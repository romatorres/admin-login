# Sistema de Animações por Scroll

## Visão Geral

Este sistema implementa animações suaves que são ativadas quando elementos entram na viewport durante o scroll da página. Utiliza a **Intersection Observer API** para detectar quando elementos ficam visíveis e aplica transições CSS para criar efeitos visuais elegantes.

## Como Funciona

### 1. Hook useScrollAnimation

O hook `useScrollAnimation` é o coração do sistema. Ele:

- Monitora quando um elemento entra na viewport
- Retorna uma referência (`ref`) para anexar ao elemento
- Retorna um estado (`isVisible`) que indica se o elemento está visível
- Usa Intersection Observer para performance otimizada

```typescript
// src/hooks/useScrollAnimation.tsx
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element); // Para a observação após primeira ativação
          }
        } else if (!triggerOnce) {
          setIsVisible(false); // Permite reativar a animação
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
```

### 2. Intersection Observer API

A **Intersection Observer API** é uma API moderna do navegador que permite:

- **Performance Superior**: Não bloqueia a thread principal como `scroll` events
- **Precisão**: Detecta exatamente quando elementos entram/saem da viewport
- **Flexibilidade**: Configurável com threshold e rootMargin

#### Parâmetros Principais:

- **threshold**: Porcentagem do elemento que deve estar visível (0.1 = 10%)
- **rootMargin**: Margem adicional ao redor da viewport ("50px" = ativa 50px antes)
- **triggerOnce**: Se `true`, anima apenas uma vez; se `false`, anima toda vez que entra/sai

## Configurações Disponíveis

```typescript
interface UseScrollAnimationOptions {
  threshold?: number; // 0.0 a 1.0 (padrão: 0.1)
  rootMargin?: string; // CSS margin syntax (padrão: "0px")
  triggerOnce?: boolean; // true = anima uma vez, false = sempre (padrão: true)
}
```

### Exemplos de Configuração:

```typescript
// Animação básica - ativa quando 10% do elemento está visível
const animation1 = useScrollAnimation();

// Ativa quando 50% do elemento está visível
const animation2 = useScrollAnimation({ threshold: 0.5 });

// Ativa 100px antes do elemento entrar na viewport
const animation3 = useScrollAnimation({ rootMargin: "100px" });

// Anima toda vez que entra/sai da viewport
const animation4 = useScrollAnimation({ triggerOnce: false });

// Configuração personalizada
const animation5 = useScrollAnimation({
  threshold: 0.3,
  rootMargin: "50px",
  triggerOnce: true,
});
```

## Implementação Prática

### Exemplo Básico

```tsx
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function AnimatedComponent() {
  const animation = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={animation.ref}
      className={`transition-all duration-700 ${
        animation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      <h2>Este conteúdo anima quando entra na tela!</h2>
    </div>
  );
}
```

### Exemplo Avançado - Múltiplas Animações

```tsx
export function ComplexAnimations() {
  const titleAnimation = useScrollAnimation({ threshold: 0.2 });
  const contentAnimation = useScrollAnimation({ threshold: 0.3 });
  const cardsAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <section>
      {/* Título com fade + slide up */}
      <div
        ref={titleAnimation.ref}
        className={`transition-[opacity,transform] duration-700 ${
          titleAnimation.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2>Título Animado</h2>
      </div>

      {/* Conteúdo com fade + slide lateral */}
      <div
        ref={contentAnimation.ref}
        className={`transition-[opacity,transform] duration-700 delay-150 ${
          contentAnimation.isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10"
        }`}
      >
        <p>Conteúdo que desliza da direita</p>
      </div>

      {/* Cards com animação escalonada */}
      <div ref={cardsAnimation.ref} className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((item, index) => (
          <div
            key={item}
            className={`transition-[opacity,transform] duration-700 ${
              cardsAnimation.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            Card {item}
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Tipos de Animações Disponíveis

### 1. Fade In/Out

```css
/* Estado inicial (invisível) */
opacity-0

/* Estado final (visível) */
opacity-100
```

### 2. Slide Animations

```css
/* Slide Up */
translate-y-10  /* inicial */
translate-y-0   /* final */

/* Slide Down */
-translate-y-10 /* inicial */
translate-y-0   /* final */

/* Slide Left */
translate-x-10  /* inicial */
translate-x-0   /* final */

/* Slide Right */
-translate-x-10 /* inicial */
translate-x-0   /* final */
```

### 3. Scale Animations

```css
/* Scale Up */
scale-95  /* inicial */
scale-100 /* final */

/* Scale Down */
scale-105 /* inicial */
scale-100 /* final */
```

### 4. Rotation

```css
/* Rotate */
rotate-12  /* inicial */
rotate-0   /* final */
```

## Exemplo Real - Componente About

Vamos analisar como o componente `About.tsx` implementa as animações:

```tsx
export function About() {
  // Diferentes animações para diferentes seções
  const titleAnimation = useScrollAnimation({ threshold: 0.2 });
  const photoAnimation = useScrollAnimation({ threshold: 0.3 });
  const contentAnimation = useScrollAnimation({ threshold: 0.3 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section>
      {/* 1. Título - Fade + Slide Up */}
      <div
        ref={titleAnimation.ref}
        className={`transition-[opacity,transform] duration-700 ${
          titleAnimation.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2>Sobre a Flashback</h2>
      </div>

      {/* 2. Fotos - Scale + Fade com delay */}
      <div
        ref={photoAnimation.ref}
        className={`transition-[opacity,transform] duration-700 delay-150 ${
          photoAnimation.isVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        {/* Grid de fotos */}
      </div>

      {/* 3. Conteúdo - Slide da direita com delay maior */}
      <div
        ref={contentAnimation.ref}
        className={`transition-[opacity,transform] duration-700 delay-300 ${
          contentAnimation.isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10"
        }`}
      >
        {/* Texto sobre a banda */}
      </div>

      {/* 4. Features - Animação escalonada */}
      <div ref={featuresAnimation.ref}>
        {features.map((feature, index) => (
          <div
            key={index}
            className={`transition-[opacity,transform] duration-700 ${
              featuresAnimation.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* Cada card anima com delay crescente */}
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Classes CSS Utilizadas

### Transições

```css
/* Transição suave para múltiplas propriedades */
transition-[opacity,transform]

/* Duração da animação */
duration-700  /* 700ms */
duration-500  /* 500ms */
duration-300  /* 300ms */

/* Delays escalonados */
delay-150     /* 150ms */
delay-300     /* 300ms */
delay-500     /* 500ms */
```

### Estados de Transformação

```css
/* Opacidade */
opacity-0     /* Invisível */
opacity-100   /* Totalmente visível */

/* Translação Y (vertical) */
translate-y-0   /* Posição normal */
translate-y-10  /* 40px para baixo */
-translate-y-10 /* 40px para cima */

/* Translação X (horizontal) */
translate-x-0   /* Posição normal */
translate-x-10  /* 40px para direita */
-translate-x-10 /* 40px para esquerda */

/* Escala */
scale-95   /* 95% do tamanho */
scale-100  /* Tamanho normal */
scale-105  /* 105% do tamanho */
```

## Padrões de Uso Recomendados

### 1. Sequência de Animações

```tsx
// Use delays crescentes para criar sequência
const title = useScrollAnimation({ threshold: 0.2 });
const subtitle = useScrollAnimation({ threshold: 0.2 });
const content = useScrollAnimation({ threshold: 0.2 });

// No JSX, aplique delays diferentes
<div className="delay-0">Título</div>
<div className="delay-150">Subtítulo</div>
<div className="delay-300">Conteúdo</div>
```

### 2. Animações Escalonadas em Listas

```tsx
// Para listas de itens
{
  items.map((item, index) => (
    <div
      key={item.id}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={animation.isVisible ? "animate-in" : "animate-out"}
    >
      {item.content}
    </div>
  ));
}
```

### 3. Diferentes Direções por Seção

```tsx
// Alterne direções para criar fluxo visual interessante
<div className="translate-x-10">  {/* Da direita */}
<div className="-translate-x-10"> {/* Da esquerda */}
<div className="translate-y-10">  {/* De baixo */}
<div className="-translate-y-10"> {/* De cima */}
```

## Performance e Boas Práticas

### 1. Use `triggerOnce: true` por padrão

```typescript
// ✅ Melhor performance - anima apenas uma vez
const animation = useScrollAnimation({ triggerOnce: true });

// ❌ Use apenas quando necessário - pode impactar performance
const animation = useScrollAnimation({ triggerOnce: false });
```

### 2. Ajuste o threshold conforme necessário

```typescript
// ✅ Para elementos grandes, use threshold menor
const bigElement = useScrollAnimation({ threshold: 0.1 });

// ✅ Para elementos pequenos, use threshold maior
const smallElement = useScrollAnimation({ threshold: 0.5 });
```

### 3. Use rootMargin para antecipar animações

```typescript
// ✅ Inicia animação antes do elemento aparecer
const animation = useScrollAnimation({ rootMargin: "100px" });
```

### 4. Limite o número de animações simultâneas

```typescript
// ✅ Agrupe elementos relacionados em uma única animação
const sectionAnimation = useScrollAnimation();

// ❌ Evite criar muitas animações individuais
const animation1 = useScrollAnimation();
const animation2 = useScrollAnimation();
const animation3 = useScrollAnimation();
// ... muitas animações
```

## Exemplos de Implementação

### Exemplo 1: Card Simples

```tsx
export function AnimatedCard({ title, content }) {
  const animation = useScrollAnimation({ threshold: 0.3 });

  return (
    <div
      ref={animation.ref}
      className={`
        p-6 rounded-lg bg-white shadow-lg
        transition-[opacity,transform] duration-500
        ${
          animation.isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }
      `}
    >
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}
```

### Exemplo 2: Lista de Produtos

```tsx
export function ProductList({ products }) {
  const animation = useScrollAnimation({ threshold: 0.1 });

  return (
    <div ref={animation.ref} className="grid grid-cols-3 gap-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`
            transition-[opacity,transform] duration-700
            ${
              animation.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 3: Hero Section

```tsx
export function HeroSection() {
  const titleAnimation = useScrollAnimation({ threshold: 0.2 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.2 });
  const buttonAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="min-h-screen flex flex-col justify-center items-center">
      <h1
        ref={titleAnimation.ref}
        className={`
          text-6xl font-bold text-center mb-4
          transition-[opacity,transform] duration-1000
          ${
            titleAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }
        `}
      >
        Bem-vindo
      </h1>

      <p
        ref={subtitleAnimation.ref}
        className={`
          text-xl text-center mb-8
          transition-[opacity,transform] duration-1000 delay-200
          ${
            subtitleAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }
        `}
      >
        Descubra nossa incrível plataforma
      </p>

      <button
        ref={buttonAnimation.ref}
        className={`
          px-8 py-4 bg-blue-600 text-white rounded-lg
          transition-[opacity,transform] duration-1000 delay-400
          ${
            buttonAnimation.isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95"
          }
        `}
      >
        Começar Agora
      </button>
    </section>
  );
}
```

## Troubleshooting

### Problemas Comuns

1. **Animação não funciona**

   - Verifique se o `ref` está sendo aplicado corretamente
   - Confirme se as classes CSS estão sendo aplicadas
   - Teste se o Intersection Observer é suportado pelo navegador

2. **Animação muito rápida/lenta**

   - Ajuste a `duration` nas classes CSS
   - Modifique o `threshold` para ativar mais cedo/tarde

3. **Elementos "pulando" na tela**

   - Defina um estado inicial consistente
   - Use `transform` ao invés de `margin` para animações

4. **Performance ruim**
   - Reduza o número de animações simultâneas
   - Use `triggerOnce: true` quando possível
   - Evite animar propriedades que causam reflow (width, height)

### Debug

```tsx
// Adicione logs para debug
const animation = useScrollAnimation({ threshold: 0.2 });

console.log("Is visible:", animation.isVisible);

// Visualize o elemento sendo observado
useEffect(() => {
  if (animation.ref.current) {
    animation.ref.current.style.border = "2px solid red";
  }
}, []);
```

## Conclusão

Este sistema de animações por scroll oferece uma maneira elegante e performática de adicionar interatividade visual ao seu site. A combinação do hook `useScrollAnimation` com classes CSS do Tailwind permite criar experiências de usuário envolventes e profissionais.

**Principais vantagens:**

- Performance otimizada com Intersection Observer
- Flexibilidade total na configuração
- Fácil implementação e manutenção
- Compatibilidade com Tailwind CSS
- Reutilizável em qualquer componente

Use este sistema para destacar conteúdo importante, guiar a atenção do usuário e criar uma experiência de navegação mais dinâmica e envolvente.
