using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TesteTecnicoReactTS.Net.WebApi.Data;
using TesteTecnicoReactTS.Net.WebApi.DTOs;
using TesteTecnicoReactTS.Net.WebApi.Models;

namespace TesteTecnicoReactTS.Net.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtém todas as categorias cadastradas
        /// </summary>
        /// <returns>Lista de Categorias</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaDTO>>> GetCategorias()
        {
            var categorias = await _context.Categorias
                .Select(c => new CategoriaDTO
                {
                    Id = c.Id,
                    Descricao = c.Descricao,
                    Finalidade = c.Finalidade
                })
                .ToListAsync();

            return Ok(categorias);
        }

        /// <summary>
        /// Obtém categorias filtradas por finalidade
        /// Obs: Inclui as categorias "Ambas"
        /// </summary>
        /// <param name="finalidade">Finalidade filtro</param>
        /// <returns>Lista de Categorias</returns>
        [HttpGet("por-finalidade/{finalidade}")]
        public async Task<ActionResult<IEnumerable<CategoriaDTO>>> GetCategoriasPorFinalidade(FinalidadeCategoria finalidade)
        {
            var categorias = await _context.Categorias
                .Where(c => c.Finalidade == finalidade || c.Finalidade == FinalidadeCategoria.Ambas)
                .Select(c => new CategoriaDTO
                {
                    Id = c.Id,
                    Descricao = c.Descricao,
                    Finalidade = c.Finalidade
                })
                .ToListAsync();

            return Ok(categorias);
        }

        /// <summary>
        /// Insere uma nova categoria
        /// </summary>
        /// <param name="criarCategoriaDto">Dados da nova categoria</param>
        /// <returns>Nova categoria</returns>
        [HttpPost]
        public async Task<ActionResult<CategoriaDTO>> PostCategoria(CriarCategoriaDTO criarCategoriaDto)
        {
            var categoria = new Categoria
            {
                Descricao = criarCategoriaDto.Descricao,
                Finalidade = criarCategoriaDto.Finalidade
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            var categoriaDto = new CategoriaDTO
            {
                Id = categoria.Id,
                Descricao = categoria.Descricao,
                Finalidade = categoria.Finalidade
            };

            return CreatedAtAction(nameof(GetCategorias), null, categoriaDto);
        }

        /// <summary>
        /// Retorna o resumo financeiro por categoria
        /// Inclui totais de receitas, despesas e saldo de cada categoria
        /// </summary>
        /// <returns>Resumo Financeiro por categoria</returns>
        [HttpGet("resumo")]
        public async Task<ActionResult<ResumoCategoriaGeralDTO>> GetResumoPorCategoria()
        {
            var categorias = await _context.Categorias
                .Include(c => c.Transacoes)
                .ToListAsync();

            var resumoPorCategoria = new List<ResumoCategoriaDTO>();

            foreach (var categoria in categorias)
            {
                var totalReceitas = categoria.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var totalDespesas = categoria.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                resumoPorCategoria.Add(new ResumoCategoriaDTO
                {
                    CategoriaId = categoria.Id,
                    Descricao = categoria.Descricao,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas
                });
            }

            var totalGeralReceitas = resumoPorCategoria.Sum(r => r.TotalReceitas);
            var totalGeralDespesas = resumoPorCategoria.Sum(r => r.TotalDespesas);

            var resumoGeral = new ResumoCategoriaGeralDTO
            {
                ResumoCategoria = resumoPorCategoria,
                TotalGeralReceitas = totalGeralReceitas,
                TotalGeralDespesas = totalGeralDespesas
            };

            return Ok(resumoGeral);
        }
    }
}
