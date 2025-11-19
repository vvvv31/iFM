// utils/audio.js - 音频处理工具

const mm = require('music-metadata');
const path = require('path');

class AudioUtil {
  /**
   * 提取音频元数据
   * @param {String} filePath - 音频文件路径
   * @returns {Promise<Object>} 音频元数据
   */
  static async extractMetadata(filePath) {
    try {
      const metadata = await mm.parseFile(filePath);
      
      return {
        duration: Math.round(metadata.format.duration) || 0, // 时长（秒）
        bitrate: Math.round(metadata.format.bitrate / 1000) || 0, // 码率（kbps）
        sampleRate: metadata.format.sampleRate || 0, // 采样率
        channels: metadata.format.numberOfChannels || 0, // 声道数
        codec: metadata.format.codec || 'unknown', // 编码格式
        title: metadata.common.title || '',
        artist: metadata.common.artist || '',
        album: metadata.common.album || ''
      };
    } catch (error) {
      console.error('提取音频元数据失败:', error);
      throw new Error('无法解析音频文件');
    }
  }

  /**
   * 验证音频质量
   * @param {Object} metadata - 音频元数据
   */
  static validateAudioQuality(metadata) {
    const errors = [];
    const warnings = [];

    // 检查码率
    if (metadata.bitrate < 128) {
      warnings.push('音频码率较低，建议使用128kbps以上');
    }
    if (metadata.bitrate > 320) {
      warnings.push('音频码率过高，建议使用320kbps以下');
    }

    // 检查采样率
    if (metadata.sampleRate < 44100) {
      warnings.push('采样率较低，建议使用44.1kHz或48kHz');
    }

    // 检查时长
    if (metadata.duration < 10) {
      errors.push('音频时长不能少于10秒');
    }
    if (metadata.duration > 7200) { // 2小时
      warnings.push('音频时长超过2小时，可能影响加载速度');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 格式化时长（秒转为 HH:MM:SS）
   */
  static formatDuration(seconds) {
    if (!seconds || seconds < 0) return '00:00';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * 解析时长字符串为秒数
   */
  static parseDuration(durationStr) {
    if (typeof durationStr === 'number') return durationStr;
    
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  /**
   * 生成音频波形数据（简化版，实际可用FFmpeg）
   * @param {String} filePath - 音频文件路径
   * @param {Number} samples - 采样点数量
   */
  static async generateWaveform(filePath, samples = 100) {
    try {
      const metadata = await this.extractMetadata(filePath);
      
      // 简化处理：生成模拟波形数据
      // 实际项目中应使用FFmpeg或Web Audio API
      const waveform = [];
      for (let i = 0; i < samples; i++) {
        waveform.push(Math.random() * 0.8 + 0.2); // 0.2-1.0之间的随机值
      }
      
      return {
        duration: metadata.duration,
        samples: waveform
      };
    } catch (error) {
      console.error('生成波形失败:', error);
      return null;
    }
  }

  /**
   * 检查音频文件完整性
   */
  static async checkIntegrity(filePath) {
    try {
      await this.extractMetadata(filePath);
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: '音频文件已损坏或格式不支持' 
      };
    }
  }
}

module.exports = AudioUtil;