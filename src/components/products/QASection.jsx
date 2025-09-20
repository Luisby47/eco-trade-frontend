import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';

export default function QASection({ productId, questions, user, onQuestionAdded, sellerId }) {
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !user) return;

    setIsSubmitting(true);
    try {
      // Simular creación de pregunta
      console.log('Creando pregunta:', {
        product_id: productId,
        user_id: user.id,
        question: newQuestion.trim()
      });

      // Simular éxito
      setNewQuestion('');
      if (onQuestionAdded) {
        onQuestionAdded();
      }
      alert('Pregunta enviada correctamente');
    } catch (error) {
      console.error('Error al enviar pregunta:', error);
      alert('Error al enviar la pregunta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Preguntas y Respuestas ({questions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Form */}
        {user && user.id !== sellerId && (
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <Textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Haz una pregunta sobre este producto..."
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={!newQuestion.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Pregunta
                </>
              )}
            </Button>
          </form>
        )}

        {!user && (
          <Alert>
            <AlertDescription>
              Inicia sesión para hacer preguntas sobre este producto
            </AlertDescription>
          </Alert>
        )}

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Aún no hay preguntas sobre este producto
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Sé el primero en preguntar algo
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border-l-2 border-green-200 pl-4 py-3">
                <div className="mb-3">
                  <p className="font-medium text-gray-900 mb-1">
                    P: {question.question}
                  </p>
                  <p className="text-xs text-gray-500">
                    Por {question.user_name} • {new Date(question.created_date).toLocaleDateString()}
                  </p>
                </div>
                
                {question.answers && question.answers.length > 0 && (
                  <div className="ml-4 space-y-2">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="bg-green-50 rounded-lg p-3">
                        <p className="text-gray-800 mb-1">
                          <span className="font-medium text-green-700">R:</span> {answer.answer}
                        </p>
                        <p className="text-xs text-green-600">
                          Por el vendedor • {new Date(answer.created_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {(!question.answers || question.answers.length === 0) && (
                  <p className="text-sm text-gray-500 ml-4 italic">
                    Esperando respuesta del vendedor...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}