#!/bin/bash
read -p "Comentarios: " comentario
git add .
git commit -m "$comentario"
git push
