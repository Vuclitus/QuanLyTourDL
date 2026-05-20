import google.generativeai as genai
from app.core.config import settings
from sqlalchemy.orm import Session
from app.models.tour import Tour as TourModel
from app.models.order import Order as OrderModel
from sqlalchemy import func, or_
from typing import List, Dict, Any, Optional
import json
from datetime import datetime

class AIService:
    def __init__(self, db: Session):
        self.db = db
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel('gemini-flash-latest')
        else:
            self.model = None

    def get_system_prompt(self, mode: str) -> str:
        if mode == "client":
            return """
Bạn là AI Travel Assistant dành cho khách hàng trong hệ thống quản lý tour du lịch LuxeVoyage.

Nhiệm vụ của bạn:
* tư vấn tour du lịch
* hỗ trợ tìm kiếm tour
* hỗ trợ đặt tour
* chăm sóc khách hàng
* giải đáp thông tin du lịch
* đề xuất tour phù hợp theo nhu cầu

Quy tắc hoạt động:
1. Luôn trả lời bằng tiếng Việt thân thiện, chuyên nghiệp và dễ hiểu.
2. Hỗ trợ khách hàng tìm tour theo: địa điểm, ngân sách, thời gian, sở thích, số người, loại hình du lịch.
3. Nếu người dùng chưa cung cấp đủ thông tin: hỏi lại tự nhiên và ngắn gọn. Ví dụ: “Bạn muốn đi khoảng mấy ngày?”, “Ngân sách dự kiến của bạn khoảng bao nhiêu?”.
4. Khi tư vấn tour, hãy hiển thị: tên tour, giá, thời gian, phương tiện, lịch trình nổi bật, khách sạn, ưu đãi nếu có.
5. Khi người dùng muốn đặt tour: hướng dẫn chọn tour, nhập thông tin, xác nhận booking, thanh toán.
6. Khi người dùng hỏi "Tour nào hot?", "Tour nào rẻ?", "Tour nào phù hợp gia đình?" => hãy đề xuất các tour phù hợp nhất từ dữ liệu thật.
7. Nếu người dùng muốn đi biển, núi, nghỉ dưỡng, khám phá => gợi ý đúng loại tour phù hợp.
8. Nếu người dùng hỏi về địa điểm: cung cấp thời tiết, món ăn nổi tiếng, địa điểm check-in, lưu ý du lịch, thời điểm đẹp để đi.
9. TUYỆT ĐỐI KHÔNG tự bịa thông tin tour. Chỉ được phép tư vấn những tour có trong [DỮ LIỆU THẬT TỪ HỆ THỐNG] được cung cấp. Nếu khách hỏi về nơi khác, hãy trả lời: "Hiện tại tôi chưa có thông tin về tour tại địa điểm này, bạn có thể tham khảo các tour hấp dẫn khác của chúng tôi như..."
10. Luôn lấy thông tin chính xác từ database: tên tour, giá tour, ngày khởi hành, số chỗ còn trống, khách sạn và phương tiện.
11. Hỗ trợ tra cứu booking, kiểm tra chỗ còn, kiểm tra lịch khởi hành, hướng dẫn hoàn/hủy tour, giải đáp chính sách.
12. Khi người dùng nhập ngân sách (ví dụ "Tôi có 5 triệu") => chỉ đề xuất tour phù hợp ngân sách.
13. Khi người dùng đi cùng gia đình => ưu tiên resort, nghỉ dưỡng, an toàn cho trẻ em.
14. Khi người dùng thích khám phá => ưu tiên trekking, camping, trải nghiệm địa phương.
15. Luôn trả lời ngắn gọn, dễ hiểu, thân thiện, giống nhân viên tư vấn thật.
16. Không trả lời nội dung vi phạm pháp luật, bạo lực, chính trị nhạy cảm.
17. Nếu người dùng chào hỏi => trả lời: "Xin chào 👋 Tôi là trợ lý du lịch AI. Tôi có thể giúp bạn tìm tour phù hợp hôm nay!"
18. Nếu người dùng hỏi "Bạn là ai?" => trả lời: "Tôi là AI Travel Assistant hỗ trợ tư vấn và đặt tour du lịch."

Mục tiêu: giúp khách hàng chọn tour nhanh chóng, nâng cao trải nghiệm, tăng tỷ lệ đặt tour thành công.
"""
        elif mode == "admin":
            return """
Bạn là AI Management Assistant trong hệ thống quản lý tour du lịch dành cho quản trị viên và nhân viên công ty.

Nhiệm vụ của bạn:
* hỗ trợ quản lý tour
* hỗ trợ quản lý khách hàng
* hỗ trợ thống kê doanh thu
* hỗ trợ phân tích dữ liệu
* hỗ trợ chăm sóc khách hàng
* hỗ trợ vận hành hệ thống

Quy tắc hoạt động:
1. Luôn trả lời: chuyên nghiệp, chính xác, ngắn gọn, dễ hiểu.
2. Hỗ trợ quản trị viên: tìm kiếm tour, quản lý booking, quản lý khách hàng, quản lý lịch khởi hành, kiểm tra số chỗ, theo dõi doanh thu, thống kê tour hot.
3. Khi admin yêu cầu: "Tour nào bán chạy nhất?" => phân tích dữ liệu booking và trả kết quả.
4. Khi admin yêu cầu: "Doanh thu tháng này?" => tổng hợp doanh thu từ hệ thống.
5. Khi admin yêu cầu: "Khách hàng nào đặt nhiều tour nhất?" => thống kê dữ liệu khách hàng.
6. Nếu hệ thống có database: ưu tiên truy vấn dữ liệu thật (được cung cấp trong ngữ cảnh): Tour, Booking, Khách hàng, Hóa đơn, Doanh thu, Lịch trình.
7. Hỗ trợ: tạo mô tả tour tự động, tạo content marketing, tạo slogan quảng bá tour.
8. Khi admin nhập: "Viết mô tả tour Đà Nẵng 3N2Đ" => tạo mô tả hấp dẫn, chuyên nghiệp.
9. Hỗ trợ phân tích: tour bán chạy, tour ít khách, xu hướng du lịch, mùa cao điểm, hiệu suất nhân viên.
10. Hỗ trợ cảnh báo: tour sắp hết chỗ, tour doanh thu thấp, booking bị hủy nhiều, lịch khởi hành trùng.
11. Hỗ trợ chatbot nội bộ: hướng dẫn nhân viên sử dụng hệ thống, giải thích chức năng quản lý, hỗ trợ thao tác nghiệp vụ.
12. Khi admin hỏi: "Khách hàng nào chưa thanh toán?" => truy xuất danh sách từ hệ thống.
13. Khi admin hỏi: "Tour nào cần quảng bá?" => phân tích tour ít booking.
14. Nếu không có dữ liệu: KHÔNG được tự tạo số liệu giả. Hãy trả lời: "Tôi chưa có dữ liệu chính xác từ hệ thống."
15. KHÔNG ĐƯỢC: xóa dữ liệu, sửa dữ liệu, thực hiện hành động nguy hiểm nếu chưa có xác nhận từ admin.
16. Nếu admin yêu cầu: xóa booking, xóa tour, cập nhật giá => yêu cầu xác nhận lại trước khi thực hiện.
17. Hỗ trợ phân quyền: Admin, Nhân viên, Khách hàng.
18. Không trả lời: nội dung vi phạm pháp luật, thông tin ngoài phạm vi hệ thống.
19. Nếu người dùng hỏi: "Bạn là ai?" => trả lời: "Tôi là AI Management Assistant hỗ trợ quản lý và vận hành hệ thống tour du lịch."

Mục tiêu: hỗ trợ quản trị hệ thống hiệu quả, giảm thao tác thủ công, tăng hiệu suất quản lý, hỗ trợ ra quyết định nhanh chóng.
"""
        return ""

    def search_tours(self, 
                    q: Optional[str] = None, 
                    destination: Optional[str] = None, 
                    max_price: Optional[float] = None,
                    category: Optional[str] = None) -> List[Dict[str, Any]]:
        query = self.db.query(TourModel).filter(TourModel.status == "active")
        
        if q:
            search = f"%{q}%"
            query = query.filter(or_(
                TourModel.name.ilike(search),
                TourModel.description.ilike(search),
                TourModel.destination.ilike(search)
            ))
        
        if destination:
            query = query.filter(TourModel.destination.ilike(f"%{destination}%"))
            
        if max_price:
            query = query.filter(TourModel.price <= max_price)
            
        if category:
            query = query.filter(TourModel.category.ilike(f"%{category}%"))
            
        tours = query.limit(5).all()
        
        result = []
        for tour in tours:
            # Check availability
            booked = self.db.query(func.sum(OrderModel.quantity)).filter(
                OrderModel.tour_id == tour.id,
                OrderModel.status != "cancelled"
            ).scalar() or 0
            
            result.append({
                "id": tour.id,
                "name": tour.name,
                "price": f"{int(tour.price):,} VNĐ",
                "destination": tour.destination,
                "duration": tour.duration,
                "category": tour.category,
                "start_date": str(tour.start_date),
                "remaining_slots": (tour.max_participants or 0) - booked,
                "vehicle": f"{tour.vehicle.type} ({tour.vehicle.plate_number})" if tour.vehicle else "Chưa xác định",
                "status": tour.status,
                "description": tour.description[:200] + "..." if tour.description else ""
            })
        return result

    def get_admin_context(self) -> str:
        from app.models.customer import Customer as CustomerModel
        from app.models.user import User as UserModel
        
        # Get all tours
        tours = self.search_tours()
        
        # Get all orders
        orders_db = self.db.query(OrderModel).all()
        orders = []
        for o in orders_db:
            orders.append({
                "id": o.id,
                "tour_id": o.tour_id,
                "customer_id": o.customer_id,
                "quantity": o.quantity,
                "total_price": float(o.total_price) if o.total_price else 0,
                "status": o.status,
                "payment_status": o.payment_status,
                "payment_method": o.payment_method,
                "created_at": str(o.created_at)
            })
            
        # Get all customers
        customers_db = self.db.query(CustomerModel).join(UserModel).all()
        customers = []
        for c in customers_db:
            customers.append({
                "id": c.id,
                "name": c.user.full_name if c.user else "Unknown",
                "email": c.user.email if c.user else "Unknown",
                "phone": c.phone,
                "rank": c.rank,
                "type": c.type,
                "created_at": str(c.created_at)
            })
            
        admin_data = {
            "tours": tours,
            "orders": orders,
            "customers": customers
        }
        
        context = f"\n[DỮ LIỆU THỐNG KÊ HỆ THỐNG]:\n{json.dumps(admin_data, ensure_ascii=False, indent=2)}\n"
        context += "\nLƯU Ý: Đây là toàn bộ dữ liệu của hệ thống. Dựa vào đây để trả lời các câu hỏi về doanh thu, khách hàng, tour bán chạy, v.v."
        return context

    async def chat(self, messages: List[Dict[str, str]], mode: str = "client") -> str:
        if not self.model:
            # Mock response if no API key
            last_msg = messages[-1]["content"].lower()
            if "xin chào" in last_msg or "hi" in last_msg:
                return "Xin chào 👋 Tôi là trợ lý du lịch AI. Tôi có thể giúp bạn tìm tour phù hợp hôm nay!"
            if "bạn là ai" in last_msg:
                return "Tôi là AI Travel Assistant hỗ trợ tư vấn và đặt tour du lịch."
            return "Xin lỗi, tôi hiện đang bảo trì hệ thống AI. Vui lòng liên hệ nhân viên qua số hotline."

        try:
            system_prompt = self.get_system_prompt(mode)
            
            context = ""
            if mode == "admin":
                context = self.get_admin_context()
            else:
                # Prepare context from database for client
                # For a small number of tours, we provide all of them to ensure accuracy.
                all_active_tours = self.search_tours() # No parameters = all active tours
                
                if all_active_tours:
                    context = f"\n[DỮ LIỆU THẬT TỪ HỆ THỐNG - CHỈ SỬ DỤNG THÔNG TIN NÀY]:\n{json.dumps(all_active_tours, ensure_ascii=False, indent=2)}\n"
                    context += "\nLƯU Ý QUAN TRỌNG: Bạn chỉ được phép tư vấn các tour có trong danh sách trên. Nếu người dùng hỏi về địa điểm hoặc tour không có trong danh sách, hãy trả lời rằng hiện tại hệ thống chưa có tour đó và đề xuất các tour có sẵn phù hợp nhất."
                else:
                    context = "\n[LƯU Ý]: Hiện tại hệ thống không có tour nào đang hoạt động. Hãy báo cho khách hàng liên hệ hotline để được tư vấn thêm."

            last_user_message = messages[-1]["content"]
            
            # Convert history for Gemini
            gemini_history = []
            for m in messages[:-1]:
                role = "user" if m["role"] == "user" else "model"
                gemini_history.append({"role": role, "parts": [m["content"]]})
            
            chat_session = self.model.start_chat(history=gemini_history)
            
            if not gemini_history:
                message_with_context = f"{system_prompt}\n{context}\n\nNgười dùng: {last_user_message}"
            else:
                message_with_context = f"{context}\n\nNgười dùng: {last_user_message}"
                
            response = await chat_session.send_message_async(message_with_context)
            
            if response and response.text:
                return response.text
            else:
                return "Tôi đã nhận được tin nhắn của bạn nhưng không thể tạo câu trả lời lúc này. Bạn có thể hỏi lại không?"
                
        except Exception as e:
            print(f"Error in AIService.chat: {str(e)}")
            return "Xin lỗi, tôi gặp sự cố kỹ thuật khi xử lý tin nhắn. Vui lòng thử lại sau hoặc liên hệ hỗ trợ viên."
