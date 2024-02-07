import express from 'express';
import * as tokensController from '../controllers/tokensController';

const router = express.Router();

router.get('/', tokensController.getAllTokens);
router.post('/create', tokensController.createTokenForUser);
router.post('/update',tokensController.updateToken);
router.get('/:tokenId/info', tokensController.getTokenInfo);

export default router;
