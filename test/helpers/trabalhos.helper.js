import request from 'supertest';
import app from '../../src/app.js';

export async function registrarTrabalho(tokenAluno, alunoId, dadosTrabalho) {
  return request(app)
    .post(`/api/alunos/${alunoId}/trabalhos`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send(dadosTrabalho);
}
