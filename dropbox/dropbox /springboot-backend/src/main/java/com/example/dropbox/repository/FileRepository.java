package com.example.dropbox.repository;

import com.example.dropbox.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    
    List<FileEntity> findAllByOrderByUploadedAtDesc();
    
    Optional<FileEntity> findByFileName(String fileName);
} 