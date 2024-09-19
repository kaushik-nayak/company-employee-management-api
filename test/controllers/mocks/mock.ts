import { Request, Response } from 'express';

export const mockRequest = (bodyData = {}, paramsData = {}, queryData = {}) => {
  const req = {
    body: bodyData,
    params: paramsData,
    query: queryData,
  } as Partial<Request>; 
  return req as Request;
};

export const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};
