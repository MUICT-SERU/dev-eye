import { Select,SelectItem, Card } from '@tremor/react';
const Settings = () => {
    const files = [
        'documents files: pdf/doc / etc',
        'images files: jpg/png/svg / etc',
        'build files: dist/build / etc',
        'lock files: package-lock.json / yarn.lock / etc',
    ];
    return ( 
        <Card className='w-[30rem]'>
            <div className="mb-4 font-mono text-sm text-slate-500">
                <h3 className='font-semibold text-tremor-content-strong'>Look Up Year</h3>
                <p className="text-xs text-tremor-content">
                    The time-frame of the analysis
                </p>
                <p className='text-xs'>description</p>
            <Select defaultValue="1" className='mt-2'>
                <SelectItem value="3">1 year</SelectItem>
                <SelectItem value="3">3 years</SelectItem>
                <SelectItem value="4">4 Years</SelectItem>
                <SelectItem value="5">5 Years</SelectItem>
            </Select>
            </div>

            <div className="mb-2 font-mono text-sm text-slate-500">
                
                <h3 className='font-semibold text-tremor-content-strong'>Files to ignore</h3>
                <p className="text-xs text-tremor-content">
                    The files listed below will be ignored during the analysis
                </p>

                <div className='flex flex-col gap-2 mt-2'>
                    {files.map((file, index) => (
                    <label  key={file} className='inline-flex items-start gap-1 text-xs'>
                    <input type="checkbox" className='p-2 border border-gray-300 rounded-md accent-blue-500 size-3 ' />
                        {file} 
                    </label>
                    ))}
                    
                </div>
            </div>

            <button className='px-8 py-1 mt-4 text-white bg-blue-400 rounded hover:bg-blue-500'>Submit</button>

        </Card>
     );
}
 
export default Settings;