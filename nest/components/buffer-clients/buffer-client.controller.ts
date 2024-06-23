import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { BufferClientService } from './buffer-client.service';
import { CreateBufferClientDto } from './dto/create-buffer-client.dto';
import { SearchBufferClientDto } from './dto/search-buffer- client.dto';
import { BufferClient } from './schemas/buffer-client.schema';

@ApiTags('Buffer Clients')
@Controller('bufferclients')
export class BufferClientController {
  constructor(private readonly clientService: BufferClientService) { }

  @Post()
  @ApiOperation({ summary: 'Create user data' })
  async create(@Body() createClientDto: CreateBufferClientDto): Promise<BufferClient> {
    return this.clientService.create(createClientDto);
  }

  @Get('update')
  @ApiOperation({ summary: 'Get all user data' })
  //@apiresponse({ status: 200, description: 'Return all user data.' })
  //@apiresponse({ status: 403, description: 'Forbidden.' })
  async updateDocs(): Promise<any> {
    return this.clientService.updatedocs();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search user data' })
  async search(@Query() query: SearchBufferClientDto): Promise<BufferClient[]> {
    return this.clientService.search(query);
  }

  @Get('checkBufferClients')
  @ApiOperation({ summary: 'checkBufferClients' })
  async checkbufferClients(): Promise<string> {
    this.clientService.checkBufferClients();
    return "initiated Checking"
  }

  @Post('addNewUserstoBufferClients')
  @ApiOperation({ summary: 'checkBufferClients' })
  @ApiBody({ type: Object })
  async addNewUserstoBufferClients(@Body() body: { goodIds: string[], badIds: string[] }): Promise<string> {
    this.clientService.addNewUserstoBufferClients(body.badIds, body.goodIds);
    return "initiated Checking"
  }

  @Get()
  @ApiOperation({ summary: 'Get all user data' })
  async findAll(): Promise<BufferClient[]> {
    return this.clientService.findAll();
  }

  @Get('SetAsBufferClient/:mobile')
  @ApiOperation({ summary: 'Set as Buffer Client' })
  @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
  async setAsBufferClient(
      @Param('mobile') mobile: string,
  ) {
      return await this.clientService.setAsBufferClient(mobile);
  }

  @Get(':mobile')
  @ApiOperation({ summary: 'Get user data by ID' })
  async findOne(@Param('mobile') mobile: string): Promise<BufferClient> {
    return this.clientService.findOne(mobile);
  }

  @Patch(':mobile')
  @ApiOperation({ summary: 'Update user data by ID' })
  async update(@Param('mobile') mobile: string, @Body() updateClientDto: Partial<BufferClient>): Promise<BufferClient> {
    return this.clientService.update(mobile, updateClientDto);
  }

  @Delete(':mobile')
  @ApiOperation({ summary: 'Delete user data by ID' })
  async remove(@Param('mobile') mobile: string): Promise<void> {
    return this.clientService.remove(mobile);
  }

  @Post('query')
  @ApiOperation({ summary: 'Execute a custom MongoDB query' })
  @ApiBody({ type: Object })
  async executeQuery(@Body() query: object): Promise<any> {
    try {
      return await this.clientService.executeQuery(query);
    } catch (error) {
      throw error;  // You might want to handle errors more gracefully
    }
  }

}
