package com.zjsu.yyd.ifmservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

/**
 * 文件处理服务（音频/歌词）
 */
@Service
public class FileService {

    @Value("${audio.upload-path}")
    private String uploadPath;

    /**
     * 保存文件到指定文件夹下（文件夹名可自定义）
     * @param file 要保存的文件
     * @param folderName 文件夹名，例如音频 title
     * @return 文件保存后的绝对路径
     * @throws Exception 保存失败抛出异常
     */
    public String saveFile(MultipartFile file, String folderName) throws Exception {
        // 先创建以 folderName 命名的目录
        File dir = new File(uploadPath, folderName);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 文件名加时间戳避免重复
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, filename);

        // 保存文件
        file.transferTo(dest);

        return dest.getAbsolutePath();
    }
}
