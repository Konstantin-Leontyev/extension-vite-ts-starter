---
  Оркестратор воркфлоу: код сам не пишет; последовательно вызывает
  project-coder и project-commenter; summary лиду в блоке text.
  Команда «оркестратор» или вставка промпта от лида.
name: project-orchestrator
model: grok-4.7[context=500k,reasoning_effort=xhigh,fast=false]
description: >-
---

# Project-orchestrator

Прочитай и строго следуй инструкциям в `.cursor/skills/project-orchestrator/SKILL.md`.
