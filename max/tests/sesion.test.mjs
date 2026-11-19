import { test } from "node:test";
import assert from "node:assert/strict";
import {
  firmar, verificar, crearSesion, sesionDesdeRequest, leerCookie, iguales,
  cookieSesion, cookieBorrarSesion, secretoValido, COOKIE_SESION,
} from "../lib/sesion.mjs";

const SECRETO = "un-secreto-de-prueba-bastante-largo-1234567890";
const OTRO = "otro-secreto-de-prueba-bastante-largo-0987654321";

test("un token firmado se verifica con el mismo secreto", async () => {
  const token = await firmar(SECRETO, { tipo: "sesion", exp: Date.now() + 60000 });
  const datos = await verificar(SECRETO, token);
  assert.equal(datos.tipo, "sesion");
});

test("un token no sirve con otro secreto", async () => {
  const token = await firmar(SECRETO, { tipo: "sesion", exp: Date.now() + 60000 });
  assert.equal(await verificar(OTRO, token), null);
});

test("un token vencido no sirve", async () => {
  const token = await firmar(SECRETO, { tipo: "sesion", exp: Date.now() - 1 });
  assert.equal(await verificar(SECRETO, token), null);
});

test("un token alterado no sirve", async () => {
  const token = await firmar(SECRETO, { tipo: "sesion", exp: Date.now() + 60000 });
  const [cuerpo, firma] = token.split(".");
  const cuerpoFalso = Buffer.from(JSON.stringify({ tipo: "sesion", exp: Date.now() + 9e9 })).toString("base64url");
  assert.equal(await verificar(SECRETO, `${cuerpoFalso}.${firma}`), null);
  assert.equal(await verificar(SECRETO, `${cuerpo}.${firma}x`), null);
  assert.equal(await verificar(SECRETO, "basura"), null);
  assert.equal(await verificar(SECRETO, ""), null);
  assert.equal(await verificar(SECRETO, null), null);
});

test("un secreto corto se rechaza", async () => {
  assert.equal(secretoValido("corto"), false);
  assert.equal(secretoValido(SECRETO), true);
  const token = await firmar("corto", { tipo: "sesion", exp: Date.now() + 60000 });
  assert.equal(await verificar("corto", token), null);
});

test("la sesión dura 12 horas", async () => {
  const ahora = Date.now();
  const { token, exp } = await crearSesion(SECRETO, ahora);
  assert.equal(exp - ahora, 12 * 3600 * 1000);
  assert.ok(await verificar(SECRETO, token, ahora + 11.9 * 3600 * 1000));
  assert.equal(await verificar(SECRETO, token, ahora + 12 * 3600 * 1000), null);
});

test("la sesión se lee desde la cookie del navegador", async () => {
  const { token } = await crearSesion(SECRETO);
  const request = new Request("https://max.example/", { headers: { cookie: `otra=1; ${COOKIE_SESION}=${token}` } });
  assert.ok(await sesionDesdeRequest(SECRETO, request));
  const sinCookie = new Request("https://max.example/");
  assert.equal(await sesionDesdeRequest(SECRETO, sinCookie), null);
});

test("un token de otro tipo no abre sesión", async () => {
  const token = await firmar(SECRETO, { tipo: "privado", exp: Date.now() + 60000 });
  const request = new Request("https://max.example/", { headers: { cookie: `${COOKIE_SESION}=${token}` } });
  assert.equal(await sesionDesdeRequest(SECRETO, request), null);
});

test("leerCookie encuentra la cookie correcta", () => {
  assert.equal(leerCookie("a=1; b=2; c=3", "b"), "2");
  assert.equal(leerCookie("a=1", "b"), null);
  assert.equal(leerCookie(null, "b"), null);
});

test("iguales compara textos", async () => {
  assert.equal(await iguales("clave-1", "clave-1"), true);
  assert.equal(await iguales("clave-1", "clave-2"), false);
  assert.equal(await iguales("", "x"), false);
  assert.equal(await iguales(undefined, "x"), false);
});

test("la cookie es HttpOnly, SameSite=Strict y Secure en https", () => {
  const segura = cookieSesion("abc", { seguro: true });
  assert.match(segura, /HttpOnly/);
  assert.match(segura, /SameSite=Strict/);
  assert.match(segura, /Secure/);
  assert.match(segura, /Max-Age=43200/);
  assert.match(cookieBorrarSesion({ seguro: true }), /Max-Age=0/);
});
