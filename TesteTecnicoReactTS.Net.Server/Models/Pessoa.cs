using System.ComponentModel.DataAnnotations;

namespace TesteTecnicoReactTS.Net.WebApi.Models
{
    public class Pessoa
    {
        /// <summary>
        /// Identificador único gerado automaticamente
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome completo da pessoa
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        /// <sumary>
        /// Idade da pessoa (deve ser positiva)
        /// </sumary>
        [Required]
        [Range(1, 150)]
        public int Idade { get; set; }

        /// <summary>
        /// Transações associadas a esta pesssoa (relacionamento)
        /// </summary>
        public List<Transacao> Transacoes { get; set; } = new();

        /// <summary>
        /// Verifica se a pessoa é menor que 18 anos
        /// </summary>
        public bool IsMenorDeIdade => Idade < 18;
    }
}
