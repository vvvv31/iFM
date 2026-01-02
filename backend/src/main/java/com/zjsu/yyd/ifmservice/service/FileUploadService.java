package com.zjsu.yyd.ifmservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload.base-path:uploads}")
    private String uploadBasePath;

    /**
     * 上传文件到指定文件夹
     */
    private String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("文件为空");
        }

        // ✅ 使用绝对路径保存文件
        String absoluteBasePath;

        if (new File(uploadBasePath).isAbsolute()) {
            absoluteBasePath = uploadBasePath;
        } else {
            absoluteBasePath = System.getProperty("user.dir") + File.separator + uploadBasePath;
        }

        Path uploadDirPath = Paths.get(absoluteBasePath, folder);

        System.out.println("=== 文件上传配置 ===");
        System.out.println("配置的 base-path: " + uploadBasePath);
        System.out.println("实际使用路径: " + absoluteBasePath);
        System.out.println("上传子目录: " + folder);
        System.out.println("完整上传目录: " + uploadDirPath.toAbsolutePath());

        // 创建目录
        if (!Files.exists(uploadDirPath)) {
            Files.createDirectories(uploadDirPath);
            System.out.println("✅ 创建上传目录成功: " + uploadDirPath.toAbsolutePath());
        } else {
            System.out.println("✅ 上传目录已存在: " + uploadDirPath.toAbsolutePath());
        }

        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String fileName = UUID.randomUUID().toString() + "." + fileExtension;

        // 保存文件
        Path filePath = uploadDirPath.resolve(fileName);

        System.out.println("开始写入文件: " + filePath.toAbsolutePath());
        System.out.println("文件大小: " + file.getSize() + " 字节");

        Files.write(filePath, file.getBytes());

        System.out.println("✅ 文件保存成功");
        System.out.println("文件路径: " + filePath.toAbsolutePath());

        // 验证文件是否存在
        if (Files.exists(filePath)) {
            System.out.println("✅ 文件确认存在: " + Files.size(filePath) + " 字节");
        } else {
            System.out.println("❌ 文件不存在！保存失败");
            throw new IOException("文件保存失败，文件不存在");
        }

        // ✅ 关键修复：返回相对于 /uploads 的路径，不包含绝对路径
        String relativePath = "/uploads/" + folder + "/" + fileName;
        System.out.println("✅ 返回相对路径: " + relativePath);

        return relativePath;
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
     * 上传帖子图片
     */
    public String uploadPostImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("文件为空");
        }

        // 验证文件类型
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("只允许上传图片文件");
        }

        // 验证文件大小（5MB）
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IOException("文件过大，请上传不超过5MB的文件");
        }

        System.out.println("=== 开始上传帖子图片 ===");
        System.out.println("文件名: " + file.getOriginalFilename());
        System.out.println("文件大小: " + file.getSize() + " 字节");
        System.out.println("文件类型: " + file.getContentType());

        return uploadFile(file, "posts");
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "bin";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}