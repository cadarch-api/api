import { Request, Response } from "express";
import { QuestionInterface, Question } from "../models/questionModel";
import { QuestionOptionInterface } from "../models/questionOptionModel";
import { addQuestionOptionUtil, readAllQuestionOptionUtil, readOneQuestionOptionUtil, deleteOneQuestionOptionUtil, updateQuestionOptionUtil } from '../utils/questionOptionUtil';

const addQuestionOption = async (req: Request, res: Response) => {
    try {

        if (req.body) {
            let QuestionOption: QuestionOptionInterface = req.body && req.body.model ? JSON.parse(req.body.model) : null;
            let response = await addQuestionOptionUtil(req, res, QuestionOption);
            res.json(response);
        }
    } catch (error) { console.log(error) }
}

const readAllQuestionOptions = async (req: any, res: any) => {
    try {
        let response = await readAllQuestionOptionUtil(req, res);
        res.json(response);
    } catch (err) { console.log(err) }
}
const updateOneQuestionOptions = async (req: any, res: any) => {
    try {
        if (req.body) {
            let QuestionOption: QuestionOptionInterface = req.body && req.body.model ? JSON.parse(req.body.model) : null;
            let response = await updateQuestionOptionUtil(req, res, QuestionOption);
            res.json(response);
        }

    } catch (err) { console.log(err) }
}

const readOneQuestionOption = async (req: any, res: any) => {
    try {
        let response = await readOneQuestionOptionUtil(req, res);
        res.json(response);
    } catch (err) { console.log(err) }
}


const deleteOneQuestionOption = async (req: any, res: Response) => {
    try {
        if (req.query.id) {
            console.log(req.query.id , "id")
            const id = req.query.id
            let response = await deleteOneQuestionOptionUtil(id);
            res.json(response);
        }
    } catch (error) { console.log(error) }
}


export { addQuestionOption, readAllQuestionOptions, readOneQuestionOption, deleteOneQuestionOption, updateOneQuestionOptions }
