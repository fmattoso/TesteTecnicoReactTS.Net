using Microsoft.OpenApi;
using System.ComponentModel.DataAnnotations;
using TesteTecnicoReactTS.Net.WebApi.Models;

namespace TesteTecnicoReactTS.Net.WebApi.DTOs
{
    /// <summary>
    /// DTO para a resposta com dados da categoria
    /// </summary>
    public class CategoriaDTO
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
        public string FinalidadeDescricao => Finalidade.GetDisplayName();
    }

    /// <summary>
    /// DTO para criação de uma nova categoria
    /// </summary>
    public class CriarCategoriaDTO
    {
        [Required]
        [MaxLength(100)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public FinalidadeCategoria Finalidade { get; set; }

    }

    /// <summary>
    /// DTO para resumo financeiro por categoria
    /// </summary>
    public class ResumoCategoriaDTO
    {
        public int CategoriaId { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }

    public class ResumoCategoriaGeralDTO
    {
        public List<ResumoCategoriaDTO> ResumoCategoria { get; set; } = new();
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquido => TotalGeralReceitas - TotalGeralDespesas;
    }
}
