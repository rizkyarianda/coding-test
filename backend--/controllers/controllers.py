import json

class Controllers :
    def get_data(self):
        with open("../dummyData.json") as File:
            data = json.load(File)
        return data
    
    def get_all(self, min_total: int):
        data = self.get_data()
        data_sales = data["salesReps"]

        result = []

        for sales in data_sales:
            # Pastikan 'deals' ada dan bukan kosong
            if 'deals' in sales and sales['deals']:
                    closed_won_values = [deal['value'] for deal in sales['deals'] if deal['status'] == 'Closed Won']
                    total_closed_won = int(sum(closed_won_values))

                    if total_closed_won > min_total:
                        # Tambahkan total_closed_won sebagai string jika perlu
                        sales['total_closed_won'] = total_closed_won
                        result.append(sales)

        return result
    
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
            