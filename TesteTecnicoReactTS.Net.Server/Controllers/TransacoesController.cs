using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TesteTecnicoReactTS.Net.WebApi.Data;
using TesteTecnicoReactTS.Net.WebApi.DTOs;
using TesteTecnicoReactTS.Net.WebApi.Models;

namespace TesteTecnicoReactTS.Net.WebApi.Controllers
{
    /// <summary>
    /// Classe Controller para gerenciamentto de Transações
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lista todas as transações cadastradas
        /// </summary>
        /// <returns>Lista de transações</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransacaoDTO>>> GetTransacoes()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .Select(t => new TransacaoDTO
                {
                    Id = t.Id,
                    Descricao = t.Descricao,
                    Valor = t.Valor,
                    Tipo = t.Tipo,
                    Data = t.Data,
                    CategoriaId = t.CategoriaId,
                    CategoriaDescricao = t.Categoria!.Descricao,
                    PessoaId = t.PessoaId,
                    PessoaNome = t.Pessoa!.Nome
                })
                .OrderByDescending(t => t.Data)
                .ToListAsync();

            return Ok(transacoes);
        }

        /// <summary>
        /// Insere uma nova transação
        /// </summary>
        /// <param name="criarTransacaoDto">Dados da nova transacao</param>
        /// <returns>Lista de Transações</returns>
        [HttpPost]
        public async Task<ActionResult<TransacaoDTO>> PostTransacao(CriarTransacaoDTO criarTransacaoDto)
        {
            // Verificar se a pessoa existe
            var pessoa = await _context.Pessoas.FindAsync(criarTransacaoDto.PessoaId);
            if (pessoa == null)
            {
                return BadRequest("Pessoa não encontrada.");
            }

            // Verificar se cattegoria existe
            var categoria = await _context.Categorias.FindAsync(criarTransacaoDto.CategoriaId);
            if (categoria == null)
            {
                return BadRequest("Categoria não encontrada.");
            }

            // Se pessoa é menor de idade, apenas despesas são permitidas
            if (pessoa.IsMenorDeIdade && criarTransacaoDto.Tipo == Models.TipoTransacao.Receita)
            {
                return BadRequest("Menores de idade não podem ter receitas.");
            }

            // Verificar tipo de transação e finalidade da categoria
            if (!IsCategoriaCompativel(categoria.Finalidade, criarTransacaoDto.Tipo))
            {
                return BadRequest($"A categoria '{categoria.Descricao}' não é compatível com o tipo '{criarTransacaoDto.Tipo}'.");
            }

            var transacao = new Transacao
            {
                Descricao = criarTransacaoDto.Descricao,
                Valor = criarTransacaoDto.Valor,
                Tipo = criarTransacaoDto.Tipo,
                CategoriaId = criarTransacaoDto.CategoriaId,
                PessoaId = criarTransacaoDto.PessoaId,
                Data = DateTime.UtcNow
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            var transacaoDto = new TransacaoDTO
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                Data = transacao.Data,
                CategoriaId = transacao.CategoriaId,
                PessoaId = transacao.PessoaId
            };

            return CreatedAtAction(nameof(GetTransacoes), null, transacaoDto);
        }

        private bool IsCategoriaCompativel(FinalidadeCategoria finalidadeCategoria, TipoTransacao tipoTransacao)
        {
            return finalidadeCategoria switch
            {
                FinalidadeCategoria.Despesa => tipoTransacao == TipoTransacao.Despesa,
                FinalidadeCategoria.Receita => tipoTransacao == TipoTransacao.Receita,
                FinalidadeCategoria.Ambas => true,
                _ => false
            };
        }
    }
}
