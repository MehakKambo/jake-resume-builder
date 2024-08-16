import os
import io
import cloudconvert
import requests
from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables from the .env file
load_dotenv()

# Read the CloudConvert API key from the .env file
CLOUDCONVERT_API_KEY = os.getenv('CLOUDCONVERT_API_KEY')

# Configure the CloudConvert API client
cloudconvert.configure(api_key=CLOUDCONVERT_API_KEY)

@app.route('/api/resume', methods=['POST'])
def generate_resume():
    data = request.json

    # Render the LaTeX template with the user's data
    latex_content = render_template('resume_template.tex', data=data)

    # Save the LaTeX content to a .tex file
    tex_file = 'resume.tex'

    with open(tex_file, 'w') as f:
        f.write(latex_content)

    try:
        # Step 1: Create a CloudConvert job for uploading, converting, and exporting the file
        job = cloudconvert.Job.create(payload={
            "tasks": {
                'upload-my-file': {
                    'operation': 'import/upload'
                },
                'convert-my-file': {
                    'operation': 'convert',
                    'input': 'upload-my-file',
                    'input_format': 'tex',
                    'output_format': 'pdf'
                },
                'export-my-file': {
                    'operation': 'export/url',
                    'input': 'convert-my-file'
                }
            }
        })

        # Step 2: Upload the LaTeX file to CloudConvert
        upload_task_id = job['tasks'][0]['id']
        upload_task = cloudconvert.Task.find(id=upload_task_id)

        # Upload the file
        with open(tex_file, 'rb') as f:
            cloudconvert.Task.upload(file_name=tex_file, task=upload_task)

        # Step 3: Wait for the job to complete
        job = cloudconvert.Job.wait(id=job['id'])

        if job['status'] != 'finished':
            return jsonify({'error': 'CloudConvert job failed'}), 500

        # Step 4: Get the export task result to download the PDF
        export_task = next(
            task for task in job['tasks'] if task['operation'] == 'export/url'
        )

        if 'result' in export_task and 'files' in export_task['result'] and len(export_task['result']['files']) > 0:
            file = export_task['result']['files'][0]
            download_url = file['url']

            # Step 5: Use requests to download the PDF into memory
            pdf_response = requests.get(download_url)

            if pdf_response.status_code == 200:
                # Create an in-memory binary stream
                pdf_stream = io.BytesIO(pdf_response.content)

                # Delete the .tex file after successfully downloading the PDF
                if os.path.exists(tex_file):
                    os.remove(tex_file)
                    print(f"{tex_file} deleted.")

                # Serve the PDF file to the frontend directly without saving locally
                return send_file(pdf_stream, mimetype='application/pdf', as_attachment=True, download_name='resume.pdf')

            else:
                # Cleanup on error
                if os.path.exists(tex_file):
                    os.remove(tex_file)
                return jsonify({'error': 'Failed to download PDF'}), 500

        else:
            # Cleanup on error
            if os.path.exists(tex_file):
                os.remove(tex_file)
            return jsonify({'error': 'Failed to retrieve PDF URL'}), 500

    except Exception as e:
        # Print the exact error message for more context
        print(f"Error during CloudConvert process: {e}")
        # Cleanup in case of an exception
        if os.path.exists(tex_file):
            os.remove(tex_file)
        return jsonify({'error': 'Failed to generate PDF'}), 500


if __name__ == "__main__":
    app.run(debug=True)