import mongoose from 'mongoose';
interface ResponseInterface {
    responseCode: number,
    responseStatus: string,
    responseMessage: string,
    basePrice?: string
    data: any,
}
export { ResponseInterface };