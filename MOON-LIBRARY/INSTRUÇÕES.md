# 📚 Moon Library - Site de Livros

Uma aplicação React moderna para buscar e descobrir livros usando a API do Google Books.

## ✨ Funcionalidades

- **Busca de Livros**: Pesquise por título ou autor em tempo real
- **API Google Books**: Integração com API pública de livros
- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Galeria Visual**: Exibição de capas dos livros em grid responsivo
- **UX Intuitiva**: Busca com Enter, feedback de carregamento e mensagens de erro

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca UI moderna
- **Vite** - Bundler rápido e otimizado
- **Fetch API** - Requisições HTTP
- **CSS3** - Estilos responsivos com Grid/Flexbox
- **Google Books API** - Base de dados de livros

## 📦 Estrutura do Projeto

```
src/
├── App.jsx                 # Componente principal
├── App.css                 # Estilos globais
├── index.css              # Reset global
├── main.jsx               # Entrada da aplicação
├── components/
│   └── Home.jsx           # Componente Home principal
└── styles/
    └── Home.css           # Estilos do componente Home
```

## 🚀 Como Executar

### 1. Instalar dependências
```bash
cd MOON-LIBRARY
npm install
```

### 2. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação abrirá automaticamente em `http://localhost:5173`

### 3. Build para produção
```bash
npm run build
```

## 📚 Como Usar

1. **Digite a sua busca**: Digite um título ou nome de autor no campo de busca
2. **Pressione Enter ou clique em "Pesquisar"**: A aplicação irá buscar livros relacionados
3. **Explore os resultados**: Veja as capas, títulos e autores dos livros encontrados
4. **Nova busca**: Digite um novo critério a qualquer momento

## 🎯 Detalhes Técnicos

### Componente Home.jsx

O componente `Home` utiliza:

- **useState**: Gerencia estado de busca, livros, carregamento e erros
- **useEffect**: Não utilizado neste caso, pois não há efeitos colaterais iniciais
- **Fetch API**: Realiza requisições HTTP para a Google Books API

#### Estados gerenciados:
```javascript
- searchQuery: string com o termo de busca
- books: array com livros retornados
- loading: boolean para controlar carregamento
- error: string com mensagens de erro
```

#### Principais funções:
```javascript
- handleSearch(query): Busca livros na API
- handleSearchClick(): Dispara busca ao clicar botão
- handleKeyPress(e): Permite buscar com Enter
- getBookInfo(book): Extrai dados seguramente do livro
```

### Google Books API

URL de requisição:
```
https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=12
```

**Parâmetros:**
- `q`: Query de busca (título, autor, etc)
- `maxResults`: Quantidade máxima de resultados (padrão: 12)

**Resposta:**
- `volumeInfo.title`: Título do livro
- `volumeInfo.authors`: Array de autores
- `volumeInfo.imageLinks.thumbnail`: URL da capa

## 📱 Responsividade

- **Desktop** (1200px+): Grid com 6-8 colunas
- **Tablet** (768px - 1199px): Grid com 4-5 colunas
- **Mobile** (480px - 767px): Grid com 2-3 colunas
- **Small Mobile** (<480px): Grid com 2 colunas

## ♿ Acessibilidade

- Suporte a navegação via teclado
- Labels semânticos para inputs
- ARIA labels para melhor leitura de tela
- Focus visível em elementos interativos
- Suporte a preferência de movimento reduzido

## 🎨 Design

- **Gradiente**: Fundo roxo degradê (`#667eea` → `#764ba2`)
- **Cards**: Design minimalista com efeito hover
- **Cores**: Branco, roxo e vermelho vivo para CTA
- **Animações**: Suaves e rápidas (0.3s)

## ⚠️ Tratamento de Erros

- Validação de campo vazio
- Tratamento de erros de rede
- Feedback visual para usuário
- Mensagens de erro clara em português

## 🔍 Exemplo de Busca

Tente buscar por:
- "Harry Potter"
- "J.K. Rowling"
- "Python Programming"
- "Game of Thrones"

## 💡 Possíveis Melhorias

- Paginação de resultados
- Filtros por gênero/ano
- Página de detalhes do livro
- Favoritos/Wishlist
- Integração com Open Library como fallback
- Dark mode toggle
- Busca avançada

## 📄 Licença

Veja o arquivo LICENSE para detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

---

Desenvolvido com ❤️ e React ⚛️
