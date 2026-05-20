from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.employee import Employee as EmployeeModel
from app.schemas.employee import Employee, EmployeeCreate, EmployeeUpdate
from app.models.user import User as UserModel
from app.core.security import get_password_hash

router = APIRouter()


@router.get("/", response_model=List[Employee])
async def get_employees(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    employees = db.query(EmployeeModel).join(UserModel).offset(skip).limit(limit).all()
    return employees


@router.get("/{employee_id}", response_model=Employee)
async def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(EmployeeModel).filter(EmployeeModel.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.post("/", response_model=Employee)
async def create_employee(employee_in: EmployeeCreate, db: Session = Depends(get_db)):
    # Enforce position
    valid_positions = ["Nhân viên", "Quản trị viên"]
    if employee_in.position not in valid_positions:
        # If not in list, default to "Nhân viên"
        employee_in.position = "Nhân viên"

    # Check if email exists
    existing_user = db.query(UserModel).filter(UserModel.email == employee_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create User
    user = UserModel(
        email=employee_in.email,
        full_name=employee_in.full_name,
        hashed_password=get_password_hash(employee_in.password or "123456"),
        role="admin" if employee_in.position == "Quản trị viên" else "employee",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create Employee
    employee_data = employee_in.model_dump(exclude={"full_name", "email", "password"})
    employee = EmployeeModel(
        **employee_data,
        user_id=user.id
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/{employee_id}", response_model=Employee)
async def update_employee(employee_id: int, employee_in: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = db.query(EmployeeModel).filter(EmployeeModel.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Update User info
    user = employee.user
    if employee_in.email and employee_in.email != user.email:
        existing = db.query(UserModel).filter(UserModel.email == employee_in.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user.email = employee_in.email
    
    if employee_in.full_name:
        user.full_name = employee_in.full_name
    
    if employee_in.position:
        user.role = "admin" if employee_in.position == "Quản trị viên" else "employee"

    # Update Employee info
    update_data = employee_in.model_dump(exclude_unset=True, exclude={"full_name", "email"})
    for key, value in update_data.items():
        setattr(employee, key, value)
    
    db.add(employee)
    db.add(user)
    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{employee_id}")
async def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(EmployeeModel).filter(EmployeeModel.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    user_id = employee.user_id
    db.delete(employee)
    
    # Also delete associated user
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user:
        db.delete(user)
        
    db.commit()
    return {"message": f"Employee {employee_id} and associated user deleted"}
