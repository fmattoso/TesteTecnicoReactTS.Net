using System.ComponentModel.DataAnnotations;

namespace TesteTecnicoReactTS.Net.WebApi.Models
{
    public class Transacao
    {
        /// <summary>
        /// Identificador único gerado automaticamente
        /// </summary>
        public int Id { get; set; }

        /// <sumary>
        /// Descrição da categoria
        /// </sumary>
        [Required]
        [MaxLength(200)]
        public string Descricao { get; set; } = string.Empty;

        /// <summary>
        /// Valor da transacao
        /// </summary>
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Valor { get; set; }

        /// <summary>
        /// Tipo de transação (Despesa/Receita)
        /// </summary>
        [Required]
        public TipoTransacao Tipo { get; set; }

        /// <summary>
        /// Data da transacao
        /// </summary>
        public DateTime Data { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Categoria da transacao (PK)
        /// </summary>
        [Required]
        public int CategoriaId { get; set; }

        /// <summary>
        /// Navegação para a categoria
        /// </summary>
        public Categoria? Categoria { get; set; }

        /// <summary>
        /// Pessoa da transacao (PK)
        /// </summary>
        [Required]
        public int PessoaId { get; set; }

        /// <summary>
        /// Navegação para a pessoa
        /// </summary>
        public Pessoa? Pessoa { get; set; }
    }

    /// <summary>
    /// Enumeração que define os tipos possíveis de transação
    /// </summary>
    public enum TipoTransacao
    {
        [Display(Name = "Despesa")]
        Despesa,

        [Display(Name = "Receita")]
        Receita
    }
}
