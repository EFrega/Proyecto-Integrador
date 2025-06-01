const request = require('supertest');
const express = require('express');

// Aquí importar la app sin iniciar el servidor, hacemos pruebas básicas

describe('API Endpoints', () => {
  test('should respond to GET /', async () => {
    // Esta es una prueba básica
    const response = await request('http://localhost:5000')
      .get('/')
      .expect(200);
    
    expect(response.text).toContain('funcionamiento');
  });
});