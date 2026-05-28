import streamlit as st
from pathlib import Path
from PIL import Image

st.set_page_config(page_title="Galeria dos Slides", layout="wide")
st.title("Galeria Técnica - Todos os Slides")
st.write("Imagens dos slides carregadas pela pasta `assets/images`, compatível com GitHub e Streamlit Cloud.")

BASE_DIR = Path(__file__).resolve().parent
PASTA_IMAGENS = BASE_DIR / "assets" / "images"

SLIDES = [
    (1, "Engenharia & Sustentabilidade", "slide01.png"),
    (2, "Introdução", "slide02.png"),
    (3, "Política Ambiental e Programas Ambientais", "slide03.png"),
    (4, "Caracterização da Empresa", "slide04.png"),
    (5, "Gestão de Resíduos Industriais", "slide05.png"),
    (6, "Tratamento de Água e Efluentes", "slide07.png"),
    (7, "Gestão dos Recursos Hídricos", "slide07.png"),
    (8, "Gestão de Água, Efluentes e Resíduos", "slide28.png"),
    (9, "Captação Hídrica", "slide09.png"),
    (10, "Uso da Água e Estruturas de Captação", "slide10_agua.png"),
    (11, "Geração de Energia por Biomassa e Licor Negro", "slide11.png"),
    (12, "Excedente de Energia e Contribuição ao SIN", "slide12.png"),
    (13, "Manejo Florestal Sustentável", "slide13.png"),
    (14, "Licenciamento Ambiental", "slide14.png"),
    (15, "Responsabilidade Socioambiental", "slide15.png"),
    (16, "Benefícios da Gestão Ambiental", "slide16.png"),
    (17, "Passivo Ambiental Identificado", "slide17.png"),
    (18, "Plano de Ação PRAD", "slide18.png"),
    (19, "Acidente Ambiental - Vazamento de Óleo", "slide19.png"),
    (20, "Plano de Ação / Cronograma", "slide20.png"),
    (21, "Cronograma de Execução dos Passivos", "slide20.png"),
    (22, "Relatório 2025 - Clima e Carbono", "slide24.png"),
    (23, "Perfil Territorial e Operações", "slide22.png"),
    (24, "Distribuição de Áreas e Localidades", "slide08.png"),
    (25, "Biodiversidade e Paisagens Sustentáveis", "slide21.png"),
    (26, "Clima, Incêndios e Inovação", "slide26.png"),
    (27, "Conformidade, Certificações e Dados-Chave", "slide27.png"),
    (28, "Consumo Hídrico e Efluentes", "slide28.png"),
    (29, "Sistema de Gestão Ambiental e Monitoramento", "slide29.png"),
    (30, "Soluções de Mitigação de Riscos Ambientais", "slide30.png"),
    (31, "Conclusão", "slide31.png"),
]


def mostrar_imagem(nome_arquivo: str, legenda: str = "") -> None:
    caminho = PASTA_IMAGENS / nome_arquivo
    if caminho.exists():
        imagem = Image.open(caminho)
        st.image(imagem, caption=legenda, use_container_width=True)
    else:
        st.error(f"Imagem não encontrada: {nome_arquivo}")
        st.info(f"Verifique se ela está em: assets/images/{nome_arquivo}")

busca = st.text_input("Buscar slide ou tema", placeholder="Ex.: água, PRAD, energia, certificações...").strip().lower()
slides_filtrados = [
    item for item in SLIDES
    if not busca or busca in str(item[0]).lower() or busca in item[1].lower() or busca in item[2].lower()
]

if not slides_filtrados:
    st.warning("Nenhum slide encontrado para essa busca.")
else:
    for linha in range(0, len(slides_filtrados), 3):
        colunas = st.columns(3)
        for coluna, (numero, titulo, arquivo) in zip(colunas, slides_filtrados[linha:linha + 3]):
            with coluna:
                st.subheader(f"Slide {numero}: {titulo}")
                mostrar_imagem(arquivo, f"Slide {numero} - {titulo}")
