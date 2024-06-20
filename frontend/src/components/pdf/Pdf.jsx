import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { format } from 'date-fns';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function PDF(nifConfirmation, productInfo, staffInfo, clientInfo) {
    let acao;

    if (nifConfirmation === true) {
        acao = "FaturaNif";
    } else if (nifConfirmation === false) {
        acao = "FaturaSemNif";
    } else {
        throw new Error('Invalid nifConfirmation value');
    }
    const currentDateTime = format(new Date(), 'dd/MM/yyyy HH:mm:ss');

    const reportTitle = [
        {
            columns: [
                {
                    text: `Criado por ${staffInfo}`,
                    fontSize: 15,
                    bold: true,
                    margin: [30, 20, 0, 10] // margem esquerda, superior, direita, inferior
                },
                {
                    text: currentDateTime,
                    alignment: 'right',
                    margin: [0, 20, 30, 10],
                    fontSize: 10
                }
            ]
        }
    ];

    const details = {
        table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'], // Largura de cada coluna
            body: [
                // Cabeçalho da tabela
                [
                    { text: 'Nome do Produto', style: 'tableHeader', fontSize: 10 },
                    { text: 'Quantidade', style: 'tableHeader', fontSize: 10, alignment: 'right' },
                    { text: 'Preço Unitário', style: 'tableHeader', fontSize: 10, alignment: 'right' },
                    { text: 'Preço sem IVA', style: 'tableHeader', fontSize: 10, alignment: 'right' },
                    { text: 'IVA 23%', style: 'tableHeader', fontSize: 10, alignment: 'right' },
                    { text: 'Total', style: 'tableHeader', fontSize: 10, alignment: 'right' }
                ]
            ]
        },
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            }
        }
    };

    // Variável para calcular o total geral
    let totalGeral = 0;

    // Verificar se productInfo é um array e tem elementos
    if (Array.isArray(productInfo) && productInfo.length > 0) {
        // Adiciona os detalhes dos produtos na tabela
        productInfo.forEach(product => {
            const precoComIVA = product.price || 0;
            const precoSemIVA = precoComIVA / 1.23; // Calcula o preço sem IVA
            const iva = 0.23 * precoSemIVA;
            const totalProduto = (product.quantity || 0) * precoComIVA;
            totalGeral += totalProduto;
            details.table.body.push(
                [
                    { text: product.name || 'N/A', fontSize: 10 },
                    { text: (product.quantity || 0).toString(), fontSize: 10, alignment: 'right' },
                    { text: `${precoComIVA.toFixed(2)} €`, fontSize: 10, alignment: 'right' },
                    { text: `${precoSemIVA.toFixed(2)} €`, fontSize: 10, alignment: 'right' },
                    { text: `${iva.toFixed(2)} €`, fontSize: 10, alignment: 'right' },
                    { text: `${totalProduto.toFixed(2)} €`, fontSize: 10, alignment: 'right' }
                ]
            );
        });
    }

    // Adiciona o total geral ao final da tabela
    details.table.body.push(
        [
            { text: 'Total Geral', style: 'tableHeader', fontSize: 12, alignment: 'right', colSpan: 5 },
            {},
            {},
            {},
            {},
            { text: `${totalGeral.toFixed(2)} €`, fontSize: 12, alignment: 'right' }
        ]
    );

    function rodape(currentPage, pageCount) {
        return [
            {
                text: currentPage + '/' + pageCount,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 30, 20, 0] // margem esquerda, superior, direita, inferior
            }
        ];
    }

    const documentDefinition = {
        pageSize: 'A4', // Tamanho da página
        pageMargins: [30, 50, 30, 40], // Margens da página (esquerda, superior, direita, inferior)
        header: reportTitle, // Título do relatório no cabeçalho
        content: [
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'], // Largura de cada coluna
                    body: [
                        // Cabeçalho da tabela
                        [
                            { text: 'Propriedade', style: 'tableHeader', fontSize: 10 },
                            { text: 'Valor', style: 'tableHeader', fontSize: 10 }
                        ],
                        // Dados do cliente
                        [
                            { text: 'Nome:', style: 'tableHeader', fontSize: 10 },
                            { text: clientInfo?.name || 'N/A', fontSize: 10 }
                        ],
                        [
                            { text: 'NIF:', style: 'tableHeader', fontSize: 10 },
                            { text: clientInfo?.nif || 'N/A', fontSize: 10 }
                        ],
                        [
                            { text: '', colSpan: 2, margin: [0, 10, 0, 10] } // Linha em branco
                        ],
                        // Dados da empresa
                        [
                            { text: 'Nome da Empresa:', style: 'tableHeader', fontSize: 10 },
                            { text: "Exemplo empressa", fontSize: 10 }
                        ],
                        [
                            { text: 'Telefone:', style: 'tableHeader', fontSize: 10 },
                            { text: "923422918", fontSize: 10 }
                        ],
                        [
                            { text: 'Morada:', style: 'tableHeader', fontSize: 10 },
                            { text: "Exemplo", fontSize: 10 }
                        ],
                        [
                            { text: '', colSpan: 2, margin: [0, 10, 0, 10] } // Linha em branco
                        ]
                    ]
                },
                layout: 'headerLineOnly' // Layout da tabela
            },
            {
                text: 'Detalhes dos Produtos',
                style: 'subheader',
                margin: [0, 10, 0, 10]
            },
            details
        ], // Conteúdo principal do PDF
        footer: rodape // Rodapé com número de páginas
    };

    pdfMake.createPdf(documentDefinition).download(acao + '.pdf');
}

export default PDF;
