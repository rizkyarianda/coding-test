from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse
from controllers.controllers import Controllers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# List domain yang diizinkan
origins = [
    "http://localhost:3000",
    "http://webapi.localhost",
    "http://127.0.0.1:3000",
    "*",  # ⚠️ Gunakan ini hanya untuk testing/dev, karena ini mengizinkan semua domain
]

# Tambahkan middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Bisa juga pakai ["*"]
    allow_credentials=True,
    allow_methods=["*"],              # Mengizinkan semua method (GET, POST, etc.)
    allow_headers=["*"],              # Mengizinkan semua headers
)

API_TOKEN = "super-secret-token"

@app.middleware("http")
async def check_token(request: Request, call_next):
  # Ambil token dari header Authorization
    auth_header = request.headers.get("Authorization")

    # if auth_header != f"Bearer {API_TOKEN}":
    #     return JSONResponse(
    #         status_code=401,
    #         content={"detail": "Unauthorized. Invalid or missing token."}
    #     )

    # Eksekusi request ke route yang dituju
    response = await call_next(request)

    return response


@app.get("/")
def read_root():
    return {"data": "Hello, FastAPI 🚀"}

@app.get("/api/v1/get-all")
def read_root(deal: int = Query(...)):
    controller = Controllers()
    data = controller.get_all(deal)

    return {"data": data}

@app.get("/api/v1/get-by-id/{id}")
def read_root(id = int):
    controller = Controllers()
    data = controller.find_by_id(id)

    return {"data": data}

@app.get("/api/v1/get-clients")
def read_root(id = int):
    controller = Controllers()
    data = controller.get_clients()

    return {"data": data}
