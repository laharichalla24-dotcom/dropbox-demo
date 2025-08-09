package com.example.dropbox.service;

import com.example.dropbox.dto.FileResponse;
import com.example.dropbox.entity.FileEntity;
import com.example.dropbox.repository.FileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileService {
    
    private final FileRepository fileRepository;
    private final Path uploadPath;
    
    public FileService(FileRepository fileRepository, @Value("${app.file.upload-dir}") String uploadDir) {
        this.fileRepository = fileRepository;
        this.uploadPath = Paths.get(uploadDir);
        createUploadDirectory();
    }
    
    private void createUploadDirectory() {
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }
    
    public FileResponse uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new IllegalArgumentException("File name cannot be empty");
        }
        
        // Validate file type
        String fileExtension = getFileExtension(originalFileName);
        if (!isSupportedFileType(fileExtension)) {
            throw new IllegalArgumentException("File type " + fileExtension + " is not supported");
        }
        
        // Validate file size (100MB limit)
        if (file.getSize() > 100 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 100MB limit");
        }
        
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        Path targetPath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(uniqueFileName);
        fileEntity.setOriginalFileName(originalFileName);
        fileEntity.setFilePath(targetPath.toString());
        fileEntity.setFileSize(file.getSize());
        fileEntity.setContentType(file.getContentType());
        
        FileEntity savedEntity = fileRepository.save(fileEntity);
        return convertToFileResponse(savedEntity);
    }
    
    public List<FileResponse> getAllFiles() {
        return fileRepository.findAllByOrderByUploadedAtDesc()
                .stream()
                .map(this::convertToFileResponse)
                .collect(Collectors.toList());
    }
    
    public Resource downloadFile(String fileName) throws IOException {
        FileEntity fileEntity = fileRepository.findByFileName(fileName)
                .orElseThrow(() -> new IllegalArgumentException("File not found: " + fileName));
        
        Path filePath = Paths.get(fileEntity.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new IOException("Could not read file: " + fileName);
        }
    }
    
    public void deleteFile(String fileName) {
        FileEntity fileEntity = fileRepository.findByFileName(fileName)
                .orElseThrow(() -> new IllegalArgumentException("File not found: " + fileName));
        
        try {
            Path filePath = Paths.get(fileEntity.getFilePath());
            Files.deleteIfExists(filePath);
            fileRepository.delete(fileEntity);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + fileName, e);
        }
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
    
    private boolean isSupportedFileType(String fileExtension) {
        String[] supportedExtensions = {
            ".txt", ".jpg", ".jpeg", ".png", ".gif", ".pdf", 
            ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", 
            ".json", ".xml", ".csv", ".zip", ".rar"
        };
        
        String extension = fileExtension.toLowerCase();
        for (String supported : supportedExtensions) {
            if (supported.equals(extension)) {
                return true;
            }
        }
        return false;
    }
    
    private FileResponse convertToFileResponse(FileEntity entity) {
        return new FileResponse(
                entity.getId(),
                entity.getFileName(),
                entity.getOriginalFileName(),
                entity.getFileSize(),
                entity.getContentType(),
                entity.getUploadedAt(),
                entity.getLastModified()
        );
    }
} 