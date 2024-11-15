import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    Res,
    Get,
    Param,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Express, Response } from "express";
import { ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FilesUploadDto } from "./dtos/files-upload.dto";

@Controller("api/uploads")
export class UploadsController {

    // POST: ~/api/uploads
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException("no file provided");

        console.log("File uploaded", { file });
        return { message: "File uploaded successfully" };
    }

    // POST: ~/api/uploads/multiple-files
    @Post('multiple-files')
    @UseInterceptors(FilesInterceptor('files'))
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: FilesUploadDto, description: 'uploading multiplle images example' })
    public uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        if (!files || files.length === 0)
            throw new BadRequestException("no file provided");

        console.log("Files uploaded", { files });
        return { message: "Files uploaded successfully" };
    }

    // GET: ~/api/uploads/:image
    @Get(":image")
    public showUploadedImage(@Param("image") image: string, @Res() res: Response) {
        return res.sendFile(image, { root: 'images' });
    }
}