import express from 'express';
import * as searchController from '../controllers/searchController';

const router = express.Router();

router.get('/', searchController.searchController);
 

export default router;
