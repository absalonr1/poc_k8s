package aopazo;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;

import com.mongodb.ServerAddress;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;

import org.bson.Document;
import java.util.Arrays;
import com.mongodb.Block;

import com.mongodb.client.MongoCursor;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.result.DeleteResult;
import static com.mongodb.client.model.Updates.*;
import com.mongodb.client.result.UpdateResult;
import java.util.ArrayList;
import java.util.List;

public class MongoCliTest1 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		MongoClient mongoClient = MongoClients.create("mongodb://hostOne:27017,hostTwo:27018");
		MongoDatabase database = mongoClient.getDatabase("mydb");
		
		 Document doc = new Document("name", "MongoDB")
	                .append("type", "database")
	                .append("count", 1)
	                .append("versions", Arrays.asList("v3.2", "v3.0", "v2.6"))
	                .append("info", new Document("x", 203).append("y", 102));
		 
		 MongoCollection<Document> collection = database.getCollection("test");
		 collection.insertOne(doc);

	}

}
