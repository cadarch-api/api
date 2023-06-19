import { Request, Response } from "express";
import { QuestionInterface, Question } from "../models/questionModel";
import { QuestionOptionInterface } from "../models/questionOptionModel";
import {
  addQuestionUtil,
  addQuestionOptionUtil,
  readAllQuestionUtil,
  readOneQuestionUtil,
  updateOneQuestionUtil,
  deleteOneQuestionUtil,
  readQuestionsMobileUtil,
  readAllQuestionDisplayOrdersUtil,
  readAllDetailedQuestionUtil,
  readAllBasicQuestionUtil,
  updateQuestionDisplayOrderUtil
} from "../utils/questionUtil";

const addQuestion = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      let Question: QuestionInterface = req.body && req.body ? req.body : null;
      let response = await addQuestionUtil(Question);
      res.json(response);
    }
  } catch (error) {
    console.log(error);
  }
};

const readAllQuestion = async (req: any, res: any) => {
  try {
    let response = await readAllQuestionUtil();
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};
const readAllBasicQuestion = async (req: any, res: any) => {
  try {
    let response = await readAllBasicQuestionUtil();
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};
const readAllDetailedQuestion = async (req: any, res: any) => {
  try {
    let response = await readAllDetailedQuestionUtil();
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

const readMobileQuestions = async (req: any, res: any) => {
  try {
    let response = await readQuestionsMobileUtil();
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

const readOneQuestion = async (req: any, res: any) => {
  try {
    const id = req.query.id;
    let response = await readOneQuestionUtil(id);
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

const readAllQuestionsDisplayOrders = async (req: any, res: any) => {
  try {
    let response = await readAllQuestionDisplayOrdersUtil();
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

const updateOneQuestion = async (req: any, res: any) => {
  try {
    const id = req.query.id;
    let response = await updateOneQuestionUtil(id, req?.body);
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};
async function updateQuestionDisplayOrder(req: any, res: any) {
  try {
    if (req.body) {
      let response = await updateQuestionDisplayOrderUtil(req.body);
      res.json(response);
    }
  } catch (err) {
    console.log(err);
  }
}
const deleteOneQuestion = async (req: any, res: any) => {
  try {
    const id = req.query.id;
    let response = await deleteOneQuestionUtil(id);
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

export {
  addQuestion,
  readAllQuestion,
  readOneQuestion,
  updateOneQuestion,
  deleteOneQuestion,
  readMobileQuestions,
  readAllQuestionsDisplayOrders,
  readAllBasicQuestion,
  readAllDetailedQuestion,
  updateQuestionDisplayOrder
};
