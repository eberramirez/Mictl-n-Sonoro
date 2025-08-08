// src/services/storyService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Nombre de la colección en Firestore
const STORIES_COLLECTION = 'stories';

/**
 * Guarda un cuento en Firebase
 * @param {Object} storyData - Datos del cuento
 * @returns {String} ID del documento creado
 */
export const saveStory = async (storyData) => {
  console.log('🔍 INICIANDO GUARDADO:', storyData);
  
  try {
    // Verificar que tenemos los datos mínimos
    if (!storyData.story || !storyData.formData) {
      throw new Error('Datos incompletos: se requiere story y formData');
    }

    // Preparar documento para Firebase
    const docData = {
      title: storyData.title || `Cuento ${new Date().toLocaleDateString('es-ES')}`,
      story: storyData.story,
      culture: storyData.formData?.cultura || 'Sin cultura especificada',
      storyType: storyData.formData?.tipoHistoria || 'Cuento tradicional',
      characterName: storyData.formData?.nombrePersonaje || 'Protagonista',
      setting: storyData.formData?.ambientacion || 'Lugar místico',
      moralLesson: storyData.formData?.ensenanza || 'Sabiduría ancestral',
      createdAt: Timestamp.now(), // Usar Timestamp de Firebase
      wordCount: storyData.story.split(' ').length,
      formData: storyData.formData, // Guardar datos completos del formulario
      
      // Metadatos adicionales
      version: '1.0',
      language: 'es',
      isInteractive: storyData.story.includes('¿Qué decide') || storyData.story.includes('[DECISIÓN:')
    };

    console.log('🔍 DATOS PREPARADOS:', docData);

    // Guardar en Firebase
    const docRef = await addDoc(collection(db, STORIES_COLLECTION), docData);
    
    console.log('✅ CUENTO GUARDADO CON ID:', docRef.id);

    // Verificar que se guardó correctamente
    const savedDoc = await getDoc(docRef);
    if (savedDoc.exists()) {
      console.log('✅ VERIFICACIÓN EXITOSA: Cuento existe en Firebase');
    } else {
      console.error('❌ ERROR: No se pudo verificar el guardado');
    }

    return docRef.id;

  } catch (error) {
    console.error('❌ ERROR AL GUARDAR CUENTO:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    // Re-lanzar con mensaje más claro
    throw new Error(`Error al guardar en Firebase: ${error.message}`);
  }
};

/**
 * Obtiene todos los cuentos guardados
 * @returns {Array} Lista de cuentos
 */
export const getStoriesFromFirebase = async () => {
  console.log('🔍 CARGANDO CUENTOS DESDE FIREBASE...');

  try {
    // Crear query ordenada por fecha de creación (más recientes primero)
    const q = query(
      collection(db, STORIES_COLLECTION), 
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    console.log(`🔍 ENCONTRADOS ${querySnapshot.size} documentos`);

    const stories = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      console.log(`🔍 Procesando documento ${doc.id}:`, data);
      
      stories.push({
        id: doc.id,
        title: data.title,
        story: data.story,
        culture: data.culture,
        storyType: data.storyType,
        characterName: data.characterName,
        setting: data.setting,
        moralLesson: data.moralLesson,
        wordCount: data.wordCount,
        isInteractive: data.isInteractive,
        formData: data.formData,
        
        // Convertir Timestamp a Date
        createdAt: data.createdAt?.toDate() || new Date(),
        
        // Metadatos
        version: data.version || '1.0',
        language: data.language || 'es'
      });
    });

    console.log(`✅ CUENTOS CARGADOS EXITOSAMENTE: ${stories.length}`);
    return stories;

  } catch (error) {
    console.error('❌ ERROR AL CARGAR CUENTOS:', error);
    throw new Error(`Error al cargar cuentos: ${error.message}`);
  }
};

/**
 * Elimina un cuento específico
 * @param {String} storyId - ID del cuento a eliminar
 */
export const deleteStory = async (storyId) => {
  console.log('🔍 ELIMINANDO CUENTO:', storyId);

  try {
    if (!storyId) {
      throw new Error('ID de cuento requerido');
    }

    // Referencia al documento
    const docRef = doc(db, STORIES_COLLECTION, storyId);
    
    // Verificar que existe antes de eliminar
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('El cuento no existe');
    }

    // Eliminar documento
    await deleteDoc(docRef);
    
    console.log('✅ CUENTO ELIMINADO EXITOSAMENTE');

  } catch (error) {
    console.error('❌ ERROR AL ELIMINAR CUENTO:', error);
    throw new Error(`Error al eliminar cuento: ${error.message}`);
  }
};

/**
 * Obtiene estadísticas de los cuentos
 * @returns {Object} Estadísticas
 */
export const getStoriesStats = async () => {
  console.log('🔍 CALCULANDO ESTADÍSTICAS...');

  try {
    const stories = await getStoriesFromFirebase();
    
    if (stories.length === 0) {
      return {
        total: 0,
        averageWords: 0,
        cultures: {},
        storyTypes: {},
        totalWords: 0
      };
    }

    // Calcular estadísticas
    const stats = {
      total: stories.length,
      totalWords: stories.reduce((sum, story) => sum + (story.wordCount || 0), 0),
      cultures: {},
      storyTypes: {}
    };

    // Contar culturas
    stories.forEach(story => {
      const culture = story.culture || 'Sin especificar';
      stats.cultures[culture] = (stats.cultures[culture] || 0) + 1;
    });

    // Contar tipos de historia
    stories.forEach(story => {
      const type = story.storyType || 'Sin especificar';
      stats.storyTypes[type] = (stats.storyTypes[type] || 0) + 1;
    });

    // Promedio de palabras
    stats.averageWords = Math.round(stats.totalWords / stats.total);

    console.log('✅ ESTADÍSTICAS CALCULADAS:', stats);
    return stats;

  } catch (error) {
    console.error('❌ ERROR AL CALCULAR ESTADÍSTICAS:', error);
    throw new Error(`Error al calcular estadísticas: ${error.message}`);
  }
};

/**
 * Obtiene un cuento específico por ID
 * @param {String} storyId - ID del cuento
 * @returns {Object} Datos del cuento
 */
export const getStoryById = async (storyId) => {
  console.log('🔍 BUSCANDO CUENTO POR ID:', storyId);

  try {
    const docRef = doc(db, STORIES_COLLECTION, storyId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Cuento no encontrado');
    }

    const data = docSnap.data();
    
    console.log('✅ CUENTO ENCONTRADO:', data);
    
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date()
    };

  } catch (error) {
    console.error('❌ ERROR AL BUSCAR CUENTO:', error);
    throw new Error(`Error al buscar cuento: ${error.message}`);
  }
};

/**
 * Función de prueba para verificar conexión con Firebase
 */
export const testFirebaseConnection = async () => {
  console.log('🔍 PROBANDO CONEXIÓN CON FIREBASE...');

  try {
    // Intentar crear un documento de prueba
    const testDoc = {
      test: true,
      message: 'Conexión exitosa',
      timestamp: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'test_connection'), testDoc);
    console.log('✅ DOCUMENTO DE PRUEBA CREADO:', docRef.id);

    // Leer el documento
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('✅ DOCUMENTO LEÍDO EXITOSAMENTE:', docSnap.data());
    }

    // Eliminar documento de prueba
    await deleteDoc(docRef);
    console.log('✅ DOCUMENTO DE PRUEBA ELIMINADO');

    return { success: true, message: 'Firebase funciona correctamente' };

  } catch (error) {
    console.error('❌ ERROR EN PRUEBA DE CONEXIÓN:', error);
    return { success: false, error: error.message };
  }
};