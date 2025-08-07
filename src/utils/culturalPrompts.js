import { CULTURAS_PREHISPANICAS, TIPOS_HISTORIA } from './culturalData';

export const createCulturalStoryPrompt = ({ 
  cultura, 
  tipoHistoria, 
  personajesPrincipales, 
  lugar, 
  tema, 
  edad,
  duracion,
  incluirDecisiones 
}) => {
  const culturaData = CULTURAS_PREHISPANICAS[cultura];
  const tipoDesc = TIPOS_HISTORIA[tipoHistoria];
  
  const contextoCultural = `
CONTEXTO CULTURAL ESPECÍFICO:
- Civilización: ${culturaData.nombre}
- Descripción: ${culturaData.descripcion}
- Elementos culturales auténticos: ${culturaData.elementos.join(', ')}
- Lugares característicos: ${culturaData.lugares.join(', ')}
- Personajes tradicionales: ${culturaData.personajes.join(', ')}
`;

  const instruccionesEspeciales = `
INSTRUCCIONES CULTURALES CRÍTICAS:
1. RESPETAR la autenticidad histórica y cultural
2. USAR elementos, nombres y conceptos genuinos de la cultura ${culturaData.nombre}
3. EVITAR anacronismos o elementos de otras culturas
4. INCORPORAR valores y cosmovisión de la civilización elegida
5. USAR un lenguaje respetuoso y educativo sobre la cultura ancestral
`;

  const formatoInteractivo = incluirDecisiones ? `
FORMATO INTERACTIVO:
- Incluir exactamente 3 momentos de decisión marcados como [DECISIÓN]
- Cada decisión debe tener 2-3 opciones claras
- Las decisiones deben influir en el desarrollo de la historia
- Formato: [DECISIÓN: ¿Qué debe hacer el protagonista?]
  Opción A: [descripción]
  Opción B: [descripción]
  Opción C: [descripción]
` : '';

  return `
Eres un narrador experto en culturas prehispánicas mexicanas. Crea un ${tipoDesc} de la cultura ${culturaData.nombre} con estas especificaciones:

${contextoCultural}

PARÁMETROS DE LA HISTORIA:
- Personajes principales: ${personajesPrincipales}
- Lugar principal: ${lugar}
- Tema central: ${tema}
- Edad del público: ${edad} años
- Duración aproximada: ${duracion} minutos de lectura
- Tipo de historia: ${tipoDesc}

${instruccionesEspeciales}

${formatoInteractivo}

ESTRUCTURA REQUERIDA:
1. Título inspirado en la cultura ${culturaData.nombre}
2. Inicio que establezca el contexto cultural
3. Desarrollo con elementos auténticos de la civilización
4. Clímax con resolución satisfactoria
5. Final que refuerce valores culturales

ELEMENTOS A INCLUIR:
- Nombres en idioma original (náhuatl, maya, zapoteco, etc.) con explicación
- Descripciones de vestimenta, arquitectura y costumbres auténticas
- Referencias a la cosmovisión y religión de la cultura
- Enseñanzas o valores propios de la civilización

LONGITUD: Aproximadamente ${duracion === 'corta' ? '300-400' : duracion === 'media' ? '500-700' : '800-1000'} palabras.

Crea una historia memorable que honre la riqueza cultural de ${culturaData.nombre} y eduque sobre su legado.
`;
};

export const createDecisionPrompt = (storyContext, currentDecision, selectedOption) => {
  return `
Continúa esta historia cultural basándote en la decisión del usuario:

CONTEXTO PREVIO:
${storyContext}

DECISIÓN TOMADA:
${selectedOption}

INSTRUCCIONES:
1. Continúa la narrativa de forma natural incorporando la decisión
2. Mantén la autenticidad cultural establecida
3. Desarrolla las consecuencias de la elección de manera interesante
4. Si es apropiado, incluye una nueva decisión para el usuario
5. Conserva el tono y estilo narrativo anterior

Continúa la historia (200-300 palabras):
`;
};