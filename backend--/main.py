from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from controllers.controllers import Controllers

app = FastAPI()
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
def read_root():
    controller = Controllers()
    data = controller.get_all()

    return {"data": data}

@app.get("/api/v1/get-by-id/{id}")
def read_root(id = int):
    controller = Controllers()
    data = controller.find_by_id(id)

    return {"data": data}
