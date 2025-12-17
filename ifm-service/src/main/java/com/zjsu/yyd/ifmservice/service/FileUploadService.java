package com.zjsu.yyd.ifmservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload.path:/uploads}")
    private String uploadPath;

    /**
     * 上传文件
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // 创建上传目录（确保使用绝对路径）
        File baseUploadDir = new File(uploadPath).getAbsoluteFile();
        File uploadDir = new File(baseUploadDir, folder);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String fileName = UUID.randomUUID().toString() + "." + fileExtension;

        // 保存文件
        File destFile = new File(uploadDir, fileName);
        file.transferTo(destFile);

        // 返回文件URL
        return "/uploads/" + folder + "/" + fileName;
    }

    /**
     * 上传音频文件
     */
    public String uploadAudio(MultipartFile file) throws IOException {
        return uploadFile(file, "audio");
    }

    /**
     * 上传封面图片
     */
    public String uploadCover(MultipartFile file) throws IOException {
        return uploadFile(file, "cover");
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}