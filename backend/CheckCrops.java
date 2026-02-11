import java.sql.*;

public class CheckCrops {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/farmxchain_db", "root", "Rathi@1805A");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, crop_name, price_per_unit FROM crops");
            System.out.println("Checking crops table...");
            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + ", Name: " + rs.getString("crop_name") + 
                                   ", Price: " + rs.getObject("price_per_unit"));
            }
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
