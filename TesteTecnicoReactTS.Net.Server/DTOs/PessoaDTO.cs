using System.ComponentModel.DataAnnotations;

namespace TesteTecnicoReactTS.Net.WebApi.DTOs
{
    /// <summary>
    /// DTO para resposta com dados da pessoa
    /// </summary>
    public class PessoaDTO
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public int Idade { get; set; }
        public bool IsMenorDeIdade { get; set; }

    }

    /// <summary>
    /// DTO para a criação de uma nova pessoa
    /// </summary>
    public class CriarPessoaDTO
    {
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [Range(1, 150)]
        public int Idade { get; set; }
    }

    /// <summary>
    /// DTO para resumo financeiro por pessoa
    /// </summary>
    public class ResumoPessoaDTO
    {
        public int PessoaId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }

    /// <summary>
    /// DTO para resumo geral
    /// </summary>
    public class ResumoGeralDTO
    {
        public List<ResumoPessoaDTO> ResumoPorPessoa { get; set; } = new();
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquido => TotalGeralReceitas - TotalGeralDespesas;
    }
}
