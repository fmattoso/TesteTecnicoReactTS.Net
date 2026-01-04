using System.ComponentModel.DataAnnotations;

namespace TesteTecnicoReactTS.Net.WebApi.Models
{
    public class Categoria
    {
        /// <summary>
        /// Identificador único gerado automaticamente
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Descrição da categoria
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string Descricao { get; set; } = string.Empty;

        /// <summary>
        /// Finalidade da categoria (Despesa/Receita/Ambas)
        /// </summary>
        public FinalidadeCategoria Finalidade { get; set; }

        /// <summary>
        /// Transações associadas a esta categoria
        /// </summary>
        public List<Transacao> Transacoes { get; set; } = new();
    }

    /// <summary>
    /// Enumeração que define as finalidades da categoria
    /// </summary>
    public enum FinalidadeCategoria
    {
        [Display(Name = "Despesa")]
        Despesa,

        [Display(Name = "Receita")]
        Receita,

        [Display(Name = "Ambas")]
        Ambas
    }
}
