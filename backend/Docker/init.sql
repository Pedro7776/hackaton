-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS sistema_academico
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE sistema_academico;

-- 1. Tabela Tag
CREATE TABLE IF NOT EXISTS Tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- 2. Tabela Cursos
CREATE TABLE IF NOT EXISTS Cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turno VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- 3. Tabela Aluno
CREATE TABLE IF NOT EXISTS Aluno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ra VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    curso_id INT NOT NULL,
    semestre INT NOT NULL,
    senha VARCHAR(255) NOT NULL,
    CONSTRAINT fk_aluno_curso 
        FOREIGN KEY (curso_id) REFERENCES Cursos(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Tabela Docente
CREATE TABLE IF NOT EXISTS Docente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    funcao VARCHAR(50),
    senha VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- 5. Tabela Funcoes
CREATE TABLE IF NOT EXISTS Funcoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    docente_id INT NOT NULL,
    CONSTRAINT fk_funcoes_docente 
        FOREIGN KEY (docente_id) REFERENCES Docente(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Tabela Post
CREATE TABLE IF NOT EXISTS Post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    texto TEXT NOT NULL,
    autor VARCHAR(100) NOT NULL,
    tag_id INT,
    anexo VARCHAR(255),
    e_aberto TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_post_tag 
        FOREIGN KEY (tag_id) REFERENCES Tag(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7. Tabela Comentario
CREATE TABLE IF NOT EXISTS Comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    autor_aluno_id INT,
    post_id INT NOT NULL,
    CONSTRAINT fk_comentario_aluno 
        FOREIGN KEY (autor_aluno_id) REFERENCES Aluno(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    CONSTRAINT fk_comentario_post 
        FOREIGN KEY (post_id) REFERENCES Post(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. Tabela Mensagem
CREATE TABLE IF NOT EXISTS Mensagem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto TEXT NOT NULL,
    autor_aluno_id INT NOT NULL,
    destinatario_aluno_id INT NOT NULL,
    CONSTRAINT fk_mensagem_autor 
        FOREIGN KEY (autor_aluno_id) REFERENCES Aluno(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_mensagem_destinatario 
        FOREIGN KEY (destinatario_aluno_id) REFERENCES Aluno(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

