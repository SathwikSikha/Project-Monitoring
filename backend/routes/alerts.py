from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Alert
from ..schemas import AlertResponse

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity: CRITICAL, WARNING, WATCH, INFO"),
    is_read: Optional[bool] = Query(None, description="Filter by read status"),
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if severity and severity.upper() != "ALL":
        query = query.filter(Alert.severity == severity.upper())
    if is_read is not None:
        query = query.filter(Alert.is_read == is_read)
        
    return query.order_by(Alert.created_at.desc()).all()

@router.put("/{alert_id}/read", response_model=AlertResponse)
def mark_alert_as_read(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    db.refresh(alert)
    return alert

@router.post("/mark-all-read")
def mark_all_alerts_read(db: Session = Depends(get_db)):
    db.query(Alert).update({Alert.is_read: True})
    db.commit()
    return {"status": "success", "message": "All alerts marked as read"}
