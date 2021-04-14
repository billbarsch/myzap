Classe PHP MyZap
========

Classe pura e simples para estudos/implementação do MyZap. A ideia de não utilizar um framework é justamente para que todos que tenham uma minima noção de PHP consigam entender e modular conforme a necessidade.

## Changelog

Por favor, cheque o arquivo de [CHANGELOG](CHANGELOG.md).

## Requisitos Necessários

É preciso usar qualquer versão do PHP igual ou superior a `7.0` e ter a biblioteca `curl` instalada.

## Instalação

1 - Crie uma pasta em seu localhost chamada `myzap` por exemplo.

2 - Copie os arquivos `index.php` e `myzap.class.php` para a pasta `myzap`.

3 - Altere o arquivo `myzap.class.php` com o ip/nome do seu `node` host

```php
<?php

  //...ADD YOUR LOCAL HOST/IP
  $this->options = [
    'LOCAL_HOST' => 'http://192.168.0.231:3333'
  ];

?>
```

## Exemplo: 
O funcionamento é básico, basta descomentar no `index.php` a função que deseja testar, alterar as váriaveis e executar.

Para enviar uma mensagem:
```php
    $myzap->sendText(['sessionName' => 'session1', 'number' => '0000000000000', 'text' => 'Funciona mesmo!!!']);
```

## Melhorias Futuras

- Adicionar todas as classes do Venom / WPPConnect
- Fazer a compatibilidade com o 


## Licença

A licença desta biblioteca é regida pela licença LGPL. Ou seja, você pode utilizá-la, como biblioteca, mesmo em projetos comerciais.
Lembre-se apenas de ser uma pessoa legal e enviar de volta eventuais modificações, correções ou melhorias.