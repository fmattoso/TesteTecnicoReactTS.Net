using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TesteTecnicoReactTS.Net.WebApi.Data;
using TesteTecnicoReactTS.Net.WebApi.DTOs;
using TesteTecnicoReactTS.Net.WebApi.Models;

namespace TesteTecnicoReactTS.Net.WebApi.Controllers
{
    /// <summary>
    /// Controller para gerenciamento de pessoas
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Construtor que recebe o contexto do banco de dados por injeção de dependência
        /// </summary>
        /// <param name="context"></param>
        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtém todas as pessoas cadastradas
        /// </summary>
        /// <returns>Lista de pessoas</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PessoaDTO>>> GetPessoas()
        {
            var pessoas = await _context.Pessoas
                .Select(p => new PessoaDTO
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Idade = p.Idade,
                    IsMenorDeIdade = p.Idade < 18
                })
                .ToListAsync();

            return Ok(pessoas);
        }

        /// <summary>
        /// Obtém uma pessoa específica pelo Id
        /// </summary>
        /// <param name="id">Id da Pessoa</param>
        /// <returns>Dados da pessoa</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<PessoaDTO>> GetPessoa(int id)
        {
            var pessoa = await _context.Pessoas
                .Where(p => p.Id == id)
                .Select(p => new PessoaDTO
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Idade = p.Idade,
                    IsMenorDeIdade = p.Idade < 18
                })
                .FirstOrDefaultAsync();

            if (pessoa == null)
            {
                return NotFound();
            }

            return Ok(pessoa);
        }

        /// <summary>
        /// Insere uma nova pessoa
        /// </summary>
        /// <param name="criarPessoaDTO">Dados da nova pessoa</param>
        /// <returns>Nova pessoa</returns>
        [HttpPost]
        public async Task<ActionResult<PessoaDTO>> PostPessoa(CriarPessoaDTO criarPessoaDTO)
        {
            var pessoa = new Pessoa
            {
                Nome = criarPessoaDTO.Nome,
                Idade = criarPessoaDTO.Idade
            };

            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();

            var pessoaDTO = new PessoaDTO
            {
                Id = pessoa.Id,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade,
                IsMenorDeIdade = pessoa.Idade < 18
            };

            return CreatedAtAction(nameof(GetPessoa), new { Id = pessoa.Id }, pessoaDTO);
        }

        /// <summary>
        /// Exclui uma pessoa pelo Id. 
        /// Obs: Todas as transações associadas serão excluídas
        /// </summary>
        /// <param name="id">Id da pessoa a ser excluída</param>
        /// <returns>Resultado da operação</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
            {
                return NotFound();
            }

            // O cascade delete está configurado no contexto
            // então as transações dessa pessoa serão excluídas automaticamente
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();

        }

        /// <summary>
        /// Ontém o resumo financeiro por pessoa
        /// Inclui totais de receitas, despesas e saldo de cada pessoa
        /// </summary>
        /// <returns>Resumo financeiro por pessoa</returns>
        [HttpGet("resumo")]
        public async Task<ActionResult<ResumoGeralDTO>> GetResumoPorPessoa()
        {
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();

            var resumoPorPessoa = new List<ResumoPessoaDTO>();

            foreach (var pessoa in pessoas)
            {
                var totalReceitas = pessoa.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var totalDespesas = pessoa.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                resumoPorPessoa.Add(new ResumoPessoaDTO
                {
                    PessoaId = pessoa.Id,
                    Nome = pessoa.Nome,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas
                });
            }

            var totalGeralReceitas = resumoPorPessoa.Sum(r => r.TotalReceitas);
            var totalGeralDespesas = resumoPorPessoa.Sum(r => r.TotalDespesas);

            var resumoGeral = new ResumoGeralDTO
            {
                ResumoPorPessoa = resumoPorPessoa,
                TotalGeralReceitas = totalGeralReceitas,
                TotalGeralDespesas = totalGeralDespesas
            };

            return Ok(resumoGeral);
        }
    }
}
