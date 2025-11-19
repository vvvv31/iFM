// utils/response.js - 统一响应格式工具

const { ERROR_CODES } = require('../config/constants');

class Response {
  /**
   * 成功响应
   * @param {Object} res - Express响应对象
   * @param {*} data - 返回数据
   * @param {String} message - 提示信息
   * @param {Number} code - 状态码
   */
  static success(res, data = null, message = 'success', code = ERROR_CODES.SUCCESS) {
    return res.status(200).json({
      code,
      message,
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 失败响应
   * @param {Object} res - Express响应对象
   * @param {String} message - 错误信息
   * @param {Number} code - 错误码
   * @param {Number} httpStatus - HTTP状态码
   */
  static error(res, message = 'error', code = ERROR_CODES.SERVER_ERROR, httpStatus = 500) {
    return res.status(httpStatus).json({
      code,
      message,
      data: null,
      timestamp: Date.now()
    });
  }

  /**
   * 分页响应
   * @param {Object} res - Express响应对象
   * @param {Array} list - 数据列表
   * @param {Number} total - 总数
   * @param {Number} page - 当前页
   * @param {Number} limit - 每页数量
   */
  static paginate(res, list, total, page, limit) {
    return res.status(200).json({
      code: ERROR_CODES.SUCCESS,
      message: 'success',
      data: {
        list,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      },
      timestamp: Date.now()
    });
  }

  /**
   * 未授权响应
   */
  static unauthorized(res, message = '未授权，请先登录') {
    return this.error(res, message, ERROR_CODES.UNAUTHORIZED, 401);
  }

  /**
   * 禁止访问响应
   */
  static forbidden(res, message = '没有权限访问') {
    return this.error(res, message, ERROR_CODES.FORBIDDEN, 403);
  }

  /**
   * 资源不存在响应
   */
  static notFound(res, message = '资源不存在') {
    return this.error(res, message, ERROR_CODES.NOT_FOUND, 404);
  }

  /**
   * 参数错误响应
   */
  static badRequest(res, message = '请求参数错误') {
    return this.error(res, message, ERROR_CODES.BAD_REQUEST, 400);
  }
}

module.exports = Response;