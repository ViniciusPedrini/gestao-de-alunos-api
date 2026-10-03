import request from 'supertest';
import app from '../../src/app.js';

export async function cadastrarAluno(tokenAdmin, dadosAluno) {
  return request(app)
    .post('/api/admin/alunos')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send(dadosAluno);
}

export async function matricularAluno(tokenAdmin, disciplinaId, alunoId) {
  return request(app)
    .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ alunoId });
}
