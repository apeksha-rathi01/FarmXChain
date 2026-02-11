import java.sql.*;

public class CheckOrders {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/farmxchain_db", "root", "Rathi@1805A");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, crop_id, quantity, total_price FROM orders");
            System.out.println("Checking orders table...");
            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + ", CropID: " + rs.getObject("crop_id") + 
                                   ", Qty: " + rs.getDouble("quantity") + ", Total: " + rs.getObject("total_price"));
            }
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
