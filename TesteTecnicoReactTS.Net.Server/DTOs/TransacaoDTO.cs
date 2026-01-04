using Microsoft.OpenApi;
using System.ComponentModel.DataAnnotations;
using TesteTecnicoReactTS.Net.WebApi.Models;

namespace TesteTecnicoReactTS.Net.WebApi.DTOs
{
    /// <summary>
    /// DTO para resposta com dados da transação
    /// </summary>
    public class TransacaoDTO
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public string TipoDescricao => Tipo.GetDisplayName();
        public DateTime Data { get; set; }
        public int CategoriaId { get; set; }
        public string CategoriaDescricao { get; set; } = string.Empty;
        public int PessoaId { get; set; }
        public string PessoaNome { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO para a criação de uma nova transação
    /// </summary>
    public class CriarTransacaoDTO
    {
        [Required]
        [MaxLength(200)]
        public string Descricao { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal Valor { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; }

        [Required]
        public int CategoriaId { get; set; }

        [Required]
        public int PessoaId { get; set; }
    }
}
