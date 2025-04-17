import json

class Controllers :
    def get_data(self):
        with open("../dummyData.json") as File:
            data = json.load(File)
        return data
    
    def get_all(self):
        data = self.get_data()
        return data
    
    def find_by_id(self,id):
        data = self.get_data()
        data_sales = data["salesReps"]

        result = next((item for item in data_sales if item['id'] == int(id)), None)

        return result
    
    def get_clients(self):
        data = self.get_data()
        data_sales = data["salesReps"]

        result = []
        for key, value in enumerate(data_sales):
            result.append(value['clients'])

        return result
            