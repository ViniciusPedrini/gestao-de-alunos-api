import { expect } from 'chai';
import { loadFixture } from './utils/loadFixture.js';
import { gerarSufixoUnico } from './utils/unique.js';
import { loginAsAdmin, loginAsAluno } from './helpers/auth.helper.js';
import { cadastrarAluno, matricularAluno } from './helpers/alunos.helper.js';
import { registrarTrabalho } from './helpers/trabalhos.helper.js';

const cenarios = loadFixture('alunos.fixture.json');

describe('Fluxo: admin cadastra aluno e aluno registra entrega de trabalho', () => {
  let tokenAdmin;

  before(async () => {
    tokenAdmin = await loginAsAdmin();
  });

  cenarios.forEach((cenario, indice) => {
    describe(`Cenário: ${cenario.nome}`, () => {
      const sufixo = gerarSufixoUnico(indice);
      const dadosAluno = {
        nome: cenario.nome,
        email: `${cenario.emailLocalPart}.${sufixo}@example.com`,
        matricula: `${cenario.matriculaPrefixo}${sufixo}`,
        senha: cenario.senha,
      };

      let alunoId;
      let tokenAluno;

      it('deve cadastrar o aluno como administrador', async () => {
        const resposta = await cadastrarAluno(tokenAdmin, dadosAluno);

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.include({ nome: dadosAluno.nome, email: dadosAluno.email });
        expect(resposta.body).to.not.have.property('senha');

        alunoId = resposta.body.id;
      });

      it('deve matricular o aluno na disciplina do cenário', async () => {
        const resposta = await matricularAluno(tokenAdmin, cenario.disciplinaId, alunoId);

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.include({ alunoId, disciplinaId: cenario.disciplinaId });
      });

      it('deve logar com sucesso como o aluno recém-cadastrado', async () => {
        tokenAluno = await loginAsAluno({ email: dadosAluno.email, senha: dadosAluno.senha });

        expect(tokenAluno).to.be.a('string').and.not.empty;
      });

      it('deve registrar a entrega do trabalho como aluno', async () => {
        const dadosTrabalho = { ...cenario.trabalho, disciplinaId: cenario.disciplinaId };
        const resposta = await registrarTrabalho(tokenAluno, alunoId, dadosTrabalho);

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.include({
          alunoId,
          disciplinaId: cenario.disciplinaId,
          titulo: cenario.trabalho.titulo,
          descricao: cenario.trabalho.descricao,
          status: 'entregue',
        });
      });
    });
  });
});
