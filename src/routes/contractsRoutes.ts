import express from 'express';
import * as contractsController from '../controllers/contractsController';

const router = express.Router();
router.get('/', contractsController.getAllContracts);
router.post('/create', contractsController.createContractForUser);
router.get('/:contractAddress/info', contractsController.getContractInfo);

export default router;
