import { ArgumentsHost, Catch, ConflictException, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class PGQueryErrorFilter implements ExceptionFilter {
    catch(err: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>()
        if (err.driverError.code = 2505) {
            let matches = err.driverError?.detail.matchAll(/\(([^)]*)\)/g);
            matches = [...matches].flat();
            response.status(409)
            .json({
                statusCode: 409,
                data: `${matches[1]} ${matches[3]} already in use`
            })
          }
        else throw err;
    }
}